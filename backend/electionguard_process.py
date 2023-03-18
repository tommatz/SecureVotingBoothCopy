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
from typing import List

import pickle


def sanitizeHardwareKeys():
    directory = '/Volumes'
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        print(filename)
        if os.path.isfile(f) == False or filename[0:2] != "Key": 
            os.remove(f)


def reestablishGuardians():
    sanitizeHardwareKeys()
    directory = 'data/keys'
    guardian_list = []
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isfile(f):
            guardian = pickle.load(open(f, 'rb'))
            guardian_list.append(guardian)

    return guardian_list



def distributeKeys(guardians):
    for i in range(len(guardians)):
        usb_path = "/Volumes/Guardian" + str(i+1)

        if os.path.isdir(usb_path):
            pickle.dump(guardians[i], open( "/Volumes/Guardian" + str(i+1) + "/Key"+str(i+1)+".p", "wb" )) #populate new keys
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

    # Publish the Joint Public Key
    joint_public_key = mediator.publish_joint_key()

    builder.set_public_key(joint_public_key.joint_public_key)
    builder.set_commitment_hash(get_optional(joint_public_key).commitment_hash)


    # get an `InternalElectionDescription` and `CiphertextElectionContext`
    # that are used for the remainder of the election.
    internal_metadata, context = get_optional(builder.build())
    print("---------------")
    print(guardian_records[0].election_public_key)

    distributeKeys(guardians)
    
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
    guardians : List[Guardian]= reestablishGuardians()
    # Will also work like this but want more control rn -tally.batch_append(encrypted_tally, True)
    # Run through all encrypted ballots and verify they are valid for the given election
    for ballot in encrypted_tally.all():
        tally.append(ballot, True)

    print(len(tally))

    mediator = DecryptionMediator("decrypt-med", context)
    submitted_ballots = list(get_ballots(encrypted_tally, BallotBoxState.CAST).values())

    for guardian in guardians:
        guardian_key = guardian.share_key()
        decryption_share = guardian.compute_tally_share(tally, context)
        ballot_shares = guardian.compute_ballot_shares(submitted_ballots, context)
        mediator.announce(guardian_key, decryption_share, ballot_shares)

    plaintext_tally = mediator.get_plaintext_tally(tally, internal_metadata)

    return plaintext_tally





#keyCeremony()
#reestablishGuardians()
#cast_or_spoil("data/electioninfo/metadata.p", "data/electioninfo/context.p")

#encrypt_ballot("data/electioninfo/metadata.p", "data/electioninfo/context.p", "data/electioninfo/ballots/plaintext_ballots/ballot01f4d0ac-caf9-44e2-95c9-81cb15858631_plaintext.p")
if __name__ == '__main__':    
    #print(load_pickle("data/electioninfo/ballots/plaintext_ballots/ballot1bdb09e2-38cf-4afd-b7a4-b77841b7bc1f_plaintext.p"))
    tally("data/electioninfo/metadata.p", "data/electioninfo/context.p")
    #print(load_pickle("data/electioninfo/ballots/plaintext_ballots/ballot1bdb09e2-38cf-4afd-b7a4-b77841b7bc1f_plaintext.p"))
