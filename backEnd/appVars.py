import logging
from enum import Enum

class Affinity(Enum):
    Admin = 0 # can perform any action (meant for developers)
    Voter = 1 # just a voter
    Guardian = 2 # just a guardian


class AppVars: # 
    logLvl = logging.debug
    affinity = Affinity.Admin
