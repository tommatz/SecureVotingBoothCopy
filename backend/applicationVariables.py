import logging
from enum import Enum

class Affinity(Enum):
    Admin = 0 # can perform any action (meant for developers)
    Voter = 1 # just a voter
    Guardian = 2 # just a guardian

class Build(Enum): # used to turn on or off unit tests
    DEBUG = 0 # Tests are on
    RELEASE = 1 # Tests are off

class AppVars: # used to store values for the application
    logLvl = logging.DEBUG
    affinity = Affinity.Admin
    build = Build.DEBUG
