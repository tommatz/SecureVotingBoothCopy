import os
from electionguard.manifest import Manifest
from electionguard.serialize import from_file
from electionguard_tools.helpers.election_builder import ElectionBuilder
from electionguard_tools.helpers import KeyCeremonyOrchestrator
from electionguard.key_ceremony import CeremonyDetails
from electionguard.key_ceremony_mediator import KeyCeremonyMediator
from electionguard.utils import get_optional
from electionguard.encrypt import EncryptionDevice, EncryptionMediator, generate_device_uuid
from electionguard.ballot import PlaintextBallot, PlaintextBallotSelection, PlaintextBallotContest
from electionguard.logs import log_info
from electionguard.guardian import Guardian
from electionguard_tools.helpers.export import export_record
from typing import List

from electionguard.constants import ElectionConstants, get_constants
from electionguard.election_polynomial import LagrangeCoefficientsRecord
import pickle
import shutil
from sys import platform
import pyAesCrypt

if platform == "win32":
    import win32api

def sanitizeKey(path):
    for filename in os.listdir(path):
        f = os.path.join(path, filename)
        if (filename[0:3].upper() != "KEY") and (filename != "System Volume Information" and filename != "Recovery") and (filename[0:1] != "."): 
            if os.path.isdir(f):
               shutil.rmtree(f)
            else:
                os.remove(f)


def nthGuardian(i):
    root = 'A'
    while root != 'Z':
        p = root + ":\\"
        if os.path.isdir(p):
            tup = win32api.GetVolumeInformation(p)
            if tup[0] == "GUARDIAN" + str(i) + "":
                return p
        
        root = chr(ord(root) + 1) #increment storage device

    return False


def sanitizeHardwareKeys():
    if platform == "darwin":
        directory = '/Volumes' #works on mac
        for filename in os.listdir(directory):
            f = os.path.join(directory, filename)
            if os.path.isdir(f) and filename[0:8].upper() == "GUARDIAN":
                sanitizeKey(f)

    elif platform == "win32":
        for i in range(0,26):
            stick = nthGuardian(i)
            if stick != False:
                sanitizeKey(stick)



def reestablishGuardians():
    sanitizeHardwareKeys()

    hardware_key = load_pickle("data/ceremony_info.p")["hardware_key"]

    if hardware_key:
        password = input("Please press gold contact on YubiKey: ")

    directory = 'data/keys'
    guardian_list = []
    found = True
    it = 0

    if platform == "darwin":
        while found == True: #scans until a guardian isnt found
            it += 1
            usb_path = "/Volumes/Guardian" + str(it)
            if os.path.isdir(usb_path):
                f = os.path.join(usb_path, "Key"+str(it)+".p")
                guardian = pickle.load(open(f, 'rb'))
                guardian_list.append(guardian)

            else:
                if hardware_key:
                    f = os.path.join(directory, f"Key{str(it)}_enc.p")
                else:
                    f = os.path.join(directory, f"Key{str(it)}.p")

                if os.path.isfile(f):
                    if hardware_key:
                        pyAesCrypt.decryptFile(f, os.path.join(directory, f"Key{str(it)}.p"), password, 65536)
                        os.remove(f)
                        f = os.path.join(directory, f"Key{str(it)}.p")

                    guardian = pickle.load(open(f, 'rb'))
                    guardian_list.append(guardian)
                else:
                    found = False

    elif platform == "win32":

        while found == True: #scans until a guardian isnt found
            it += 1
            stick = nthGuardian(it)
            if stick != False:
                for filename in os.listdir(stick):
                    if filename[0:3].upper() == "KEY":
                        f = os.path.join(stick, filename)
                        guardian = pickle.load(open(f, 'rb'))
                        guardian_list.append(guardian)

            else:
                f = os.path.join(directory, "Key"+str(it)+".p")
                if os.path.isfile(f):
                    guardian = pickle.load(open(f, 'rb'))
                    guardian_list.append(guardian)
                else:
                    found = False

    return guardian_list

import io
def distributeKeys(guardians, hardware_key):

    if hardware_key:
        password = input("Please short press gold contact on yubikey: ")
        

    if platform == "darwin":
        usb_path = ""
        for i in range(len(guardians)):
            usb_path = f"/Volumes/Guardian{str(i+1)}"
           
            if os.path.isdir(usb_path):
                usb_path += f"/Key{str(i+1)}.p"
                pickle.dump(guardians[i], open(usb_path, "wb" )) #populate new keys

            else:
                usb_path = f"data/keys/Key{str(i+1)}"
                if hardware_key:
                    usb_path += "_enc.p"
                    with open(usb_path, "wb") as encrypt_file:
                        pickled_guardian = pickle.dumps(guardians[i])
                        pyAesCrypt.encryptStream(io.BytesIO(pickled_guardian), encrypt_file, password, 65536)
                else:
                    usb_path += ".p"
                    pickle.dump(guardians[i], open(usb_path, "wb" )) #if usb fails, save to local area

        

    elif platform == "win32":

        for i in range(len(guardians)):
            stick = nthGuardian(i+1)
            if stick != False:
                pickle.dump(guardians[i], open(stick + "/Key"+str(i+1)+".p", "wb" )) #populate new keys
            else:
                pickle.dump(guardians[i], open( "data/keys/Key"+str(i+1)+".p", "wb" )) #if usb fails, save to local area



def keyCeremony():
    election_description = from_file(Manifest, "data/manifest.json")
    election_info = load_pickle("data/ceremony_info.p")

    builder = ElectionBuilder(
        number_of_guardians=election_info["no_guardians"], 
        quorum=election_info["no_quorum"],  
        manifest=election_description
    )

    details = CeremonyDetails(builder.number_of_guardians, builder.quorum)

    guardians = KeyCeremonyOrchestrator.create_guardians(details)

    mediator = KeyCeremonyMediator("mediator", details)

    """Announce guardians and share public keys"""

    # When a guardian is announced it shows that they are participating in the key ceremony and shares their public key
    # The public keys for each guardian is distributed to each of them to allow other guardians to know they are present
    KeyCeremonyOrchestrator.perform_round_1(guardians, mediator)


    """Generate key backups and share backups"""
    # Election key backups are generated using an id, a secret polynomial, and thee guardians public key
    # Each guardian will recieve a partial key backup for the private key to ensure decryption will work in the event one is missing
    KeyCeremonyOrchestrator.perform_round_2(guardians, mediator)

    """Verifying backups and passing them along to mediator"""
    KeyCeremonyOrchestrator.perform_round_3(guardians, mediator)

    guardian_records = [guardian.publish() for guardian in guardians]


    with open("data/electioninfo/guardian_records.p", "wb") as f:
        f.write(pickle.dumps(guardian_records))

    # Publish the Joint Public Key
    joint_public_key = mediator.publish_joint_key()

    builder.set_public_key(joint_public_key.joint_public_key)
    builder.set_commitment_hash(get_optional(joint_public_key).commitment_hash)


    # get an `InternalElectionDescription` and `CiphertextElectionContext`
    # that are used for the remainder of the election.
    internal_metadata, context = get_optional(builder.build())
    election_constants = get_constants()

    with open("data/electioninfo/election_constants.p", "wb") as f:
        f.write(pickle.dumps(election_constants))

    print("---------------")
    print(guardian_records[0].election_public_key)

    distributeKeys(guardians, election_info["hardware_key"])
    
    with open("data/electioninfo/metadata.p", 'wb') as f:
        f.write(pickle.dumps(internal_metadata))

    with open("data/electioninfo/context.p", 'wb') as f:
        f.write(pickle.dumps(context))



    with open(f'data/electioninfo/ballots/store.p', 'wb') as f:
        f.write(pickle.dumps(DataStore()))

    # arg0: device_id - Unique identifier for the encryption deivce
    # arg1: session_id - used to identify session
    # arg2: launch_code - election initilization value
    # arg3: location - string used to identify location of device
    device = EncryptionDevice(generate_device_uuid(), "Session", 5678, "polling-place-one")


    with open(f'data/electioninfo/encryption/encrpytion_device.p', 'wb') as f:
        f.write(pickle.dumps(device))

def load_pickle(path):
    with open(path, 'rb') as file:
        return pickle.loads(file.read())

def encrypt_ballot(metadata_path, context_path, ballot_path):

    # arg0: device_id - Unique identifier for the encryption deivce
    # arg1: session_id - used to identify session
    # arg2: launch_code - election initilization value
    # arg3: location - string used to identify location of device
    device = load_pickle("data/electioninfo/encryption/encrpytion_device.p")


    internal_metadata = load_pickle(metadata_path)
    context = load_pickle(context_path)
    ballot = load_pickle(ballot_path)

    encrypter = EncryptionMediator(internal_metadata, context, device)

    return encrypter.encrypt(ballot)



from electionguard.ballot_box import BallotBox
from electionguard.data_store import DataStore

def cast_or_spoil(metadata_path, context_path, encrypted_ballot, spoiled):
    internal_metadata = load_pickle(metadata_path)
    context = load_pickle(context_path)
    store = load_pickle('data/electioninfo/ballots/store.p')

    ballot_box = BallotBox(internal_metadata, context, store)
    log_info("Ballot box successfully created")
    log_info(ballot_box)

    if not spoiled:
        ballot_box.cast(encrypted_ballot)
        log_info("Successfully casted ballot")
    else:
        ballot_box.spoil(encrypted_ballot)
        log_info("Successfully spoiled ballot")

    with open('data/electioninfo/ballots/store.p', 'wb') as f:
        f.write(pickle.dumps(store))
    log_info("Successfully pickled datastore")



from electionguard.tally import CiphertextTally
from electionguard.decryption_mediator import DecryptionMediator
from electionguard.ballot_box import get_ballots
from electionguard.ballot import BallotBoxState
def tally(metadata_path, context_path):
    internal_metadata = load_pickle(metadata_path)
    context = load_pickle(context_path)

    tally = CiphertextTally("tally_test", internal_metadata, context)
    encrypted_tally = load_pickle("data/electioninfo/ballots/store.p")
    guardians : List[Guardian] = reestablishGuardians()

    
    # Will also work like this but want more control rn -tally.batch_append(encrypted_tally, True)
    # Run through all encrypted ballots and verify they are valid for the given election
    for ballot in encrypted_tally.all():
        tally.append(ballot, True)

    print(len(tally))

    mediator = DecryptionMediator("decrypt-med", context)
    submitted_ballots = list(get_ballots(encrypted_tally, BallotBoxState.CAST).values())
    spoiled_ballots = list(get_ballots(encrypted_tally, BallotBoxState.SPOILED).values())

    with open(f'data/electioninfo/submitted__enc_ballots.p', 'wb') as f:
        f.write(pickle.dumps(submitted_ballots))

    for guardian in guardians:
        guardian_key = guardian.share_key()
        decryption_share = guardian.compute_tally_share(tally, context)
        ballot_shares = guardian.compute_ballot_shares(spoiled_ballots, context)
        mediator.announce(guardian_key, decryption_share, ballot_shares)

    plaintext_tally = get_optional(mediator.get_plaintext_tally(tally, internal_metadata))
    plaintext_spoiled_ballots = get_optional(mediator.get_plaintext_ballots(spoiled_ballots, internal_metadata))






    lagrange_coefficients = LagrangeCoefficientsRecord(mediator.get_lagrange_coefficients())

    
    with open(f'data/electioninfo/coefficients.p', 'wb') as f:
        f.write(pickle.dumps(lagrange_coefficients))

    with open(f'data/electioninfo/ciphertext_tally.p', 'wb') as f:
        f.write(pickle.dumps(tally))      

    with open(f'data/electioninfo/plaintext_tally.p', 'wb') as f:
        f.write(pickle.dumps(plaintext_tally))  

    with open(f'data/electioninfo/plaintext_spoiled_ballots_.p', 'wb') as f:
        f.write(pickle.dumps(plaintext_spoiled_ballots))  


        

    return plaintext_tally


def export_records(manifest_path, context_path, constants_path, enc_device_path,
                           submitted_ballots_path, spoiled_ballots_path, ciphertext_tally_path,
                            plaintext_tally_path, guaradian_record_path, coefficients_path,
                            election_record):
    manifest = from_file(Manifest, manifest_path)
    context = load_pickle(context_path)
    election_constants = load_pickle(constants_path)
    encryption_device = load_pickle(enc_device_path)
    submitted_ballots = load_pickle(submitted_ballots_path).all() # datastore
    spoiled_ballots = load_pickle(spoiled_ballots_path).values()
    ciphertext_tally = load_pickle(ciphertext_tally_path).publish()
    plaintext_tally = load_pickle(plaintext_tally_path)
    guardian_records = load_pickle(guaradian_record_path)


    lagrange_coefficients = load_pickle(coefficients_path)

    export_record(manifest, context, election_constants, [encryption_device],
                  submitted_ballots, spoiled_ballots, ciphertext_tally,
                  plaintext_tally, guardian_records, lagrange_coefficients, election_record)


#keyCeremony()
#reestablishGuardians()
#cast_or_spoil("data/electioninfo/metadata.p", "data/electioninfo/context.p")

#encrypt_ballot("data/electioninfo/metadata.p", "data/electioninfo/context.p", "data/electioninfo/ballots/plaintext_ballots/ballot01f4d0ac-caf9-44e2-95c9-81cb15858631_plaintext.p")
if __name__ == '__main__':    
    from datetime import datetime
    ballot = load_pickle("data/electioninfo/ballots/encrypted_ballots/ballot000da3a6-3127-4a3f-9896-692f2f7fc4d2_encrypt.p")


    #print(load_pickle("data/electioninfo/ballots/plaintext_ballots/ballot1bdb09e2-38cf-4afd-b7a4-b77841b7bc1f_plaintext.p"))
    #print(tally("data/electioninfo/metadata.p", "data/electioninfo/context.p"))

    #print(load_pickle("data/electioninfo/ballots/plaintext_ballots/ballot1bdb09e2-38cf-4afd-b7a4-b77841b7bc1f_plaintext.p"))
