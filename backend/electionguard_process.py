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

import pickle

def reestablishGuardians():
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
        pickle.dump(guardians[i], open( "data/keys/Key"+str(i+1)+".p", "wb" ))



def keyCeremony(no_guardians, no_quorum):
    election_description = from_file(Manifest, "data/manifest.json")

    builder = ElectionBuilder(
        number_of_guardians=no_guardians, 
        quorum=no_quorum,  
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






def encrypt_ballot(metadata_path, context_path, ballot_path):

    # arg0: device_id - Unique identifier for the encryption deivce
    # arg1: session_id - used to identify session
    # arg2: launch_code - election initilization value
    # arg3: location - string used to identify location of device
    device = EncryptionDevice(generate_device_uuid(), "Session", 5678, "polling-place-one")


    with open(metadata_path, 'rb') as file:
        internal_metadata = pickle.loads(file.read())

    with open(context_path, 'rb') as file:
        context = pickle.loads(file.read())

    with open(ballot_path, 'rb') as file:
        ballot = pickle.loads(file.read())

    encrypter = EncryptionMediator(internal_metadata, context, device)

    return encrypter.encrypt(ballot)



#keyCeremony()
#reestablishGuardians()