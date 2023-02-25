import os
from electionguard.manifest import Manifest
from electionguard.serialize import from_file
from electionguard_tools.helpers.election_builder import ElectionBuilder
from electionguard_tools.helpers import KeyCeremonyOrchestrator
from electionguard.key_ceremony import CeremonyDetails
from electionguard.key_ceremony_mediator import KeyCeremonyMediator
from electionguard.utils import get_optional
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



def keyCeremony():
    election_description = from_file(Manifest, "election-manifest.json")

    builder = ElectionBuilder(
        number_of_guardians=2, 
        quorum=1,  
        manifest=election_description
    )

    details = CeremonyDetails(builder.number_of_guardians, builder.quorum)

    guardians = KeyCeremonyOrchestrator.create_guardians(details)

    mediator = KeyCeremonyMediator("mediator", details)
    KeyCeremonyOrchestrator.perform_full_ceremony(guardians, mediator)

    guardian_records = [guardian.publish() for guardian in guardians]

    # Publish the Joint Public Key
    joint_public_key = mediator.publish_joint_key()

    builder.set_public_key(joint_public_key)
    builder.set_commitment_hash(get_optional(joint_public_key).commitment_hash)

    # get an `InternalElectionDescription` and `CiphertextElectionContext`
    # that are used for the remainder of the election.
    internal_metadata, context = get_optional(builder.build())
    print("---------------")
    print(guardian_records[0].election_public_key)

    distributeKeys(guardians)

keyCeremony()
reestablishGuardians()