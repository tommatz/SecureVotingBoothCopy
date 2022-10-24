#driver class for backend of project
import unittest
import re
from xmlrpc.client import Boolean
import logging
import datetime
import applicationVariables
import pathlib

def getLogin(): # used to get the login information from a voter TODO: change from command line to from front end with fast API
    print("enter your social security number (ddd-dd-dddd)")
    SSN = str(input())
    return SSN
        
def checkSSN(SSN): # Checks the SSN against a regex to check if the value is possible (we assume that it is checked for accuracy by the board of elections personel since we cannot search a db for it and they already do it)
    searchObj = re.search("^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$",SSN) # confirms the social is a possible value
    if (searchObj == None):
        print("invalid social security number")
        return False
    else:
        SSN = searchObj.string
    return True

def setLogging():
    date = datetime.date.today()
    path = pathlib.Path(__file__).parent.resolve() # get the file path of this file
    logging.basicConfig(filename=str(path) + "/logs/" + str(date) + ".log", filemode='a' ,
    encoding='utf-8', level=applicationVariables.AppVars.logLvl, 
    format='%(asctime)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S') # sets the configuration for the logging and creates the file
    

def main(): # Main driver for program
    setLogging() # starts the logging
    logging.info("Starting app")
    print("Creators: Lucas Nagle, Tom Matz, Ryan Harris, and Gerry Pasquale")
    print("Client: Dr. Chad Mourning")
    print("Team: Just-Bobcats")
    logging.info("printed info")
    #TODO: update to match new requirements from client(10/21/22) for first, last, address
    SSN = getLogin()
    isSSN = Boolean(checkSSN(SSN))
    while not isSSN:
        SSN = getLogin()
        isSSN = Boolean(checkSSN(SSN))
    logging.info("Terminating app")
    return 0


        
# example of how to set up unit tests
class Test(unittest.TestCase): 
    "basic class that inherits unittest.TestCase"

    def test_0(self): # check valid
        soc = "123-45-6789"
        valid = Boolean(checkSSN(soc))
        self.assertEqual(valid,True)
    
    def test_1(self): # check too many digits
        soc = "123-45-67890"
        valid = Boolean(checkSSN(soc))
        self.assertEqual(valid,False)

    def test_3(self): # check too many digits
        soc = "0123-45-6789"
        valid = Boolean(checkSSN(soc))
        self.assertEqual(valid,False)
    
    def test_4(self): # check 666's validity
        soc = "666-45-6789"
        valid = Boolean(checkSSN(soc))
        self.assertEqual(valid,False)

    

    #main method to start code from
if __name__ == "__main__":    
    main()
    if applicationVariables.AppVars.build == applicationVariables.Build.DEBUG: # TODO: change this solution to match what Ryan did with fast API testing
        unittest.main() # run the unit tests 
 




              
        

