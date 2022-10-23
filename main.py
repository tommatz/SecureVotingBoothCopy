#driver class for backend of project


import unittest
import re
from xmlrpc.client import Boolean
import logging
import datetime

class Driver:
    SSN = "" # Social security number storage TODO: change location as project grows
    LogLvl = logging.DEBUG # sets the level for logging

    def getLogin(self): # used to get the login information from a voter TODO: change from command line to from front end
        print("enter your social security number (no -'s)")
        self.SSN = str(input())
        
    def checkSSN(self): #Checks the SSN against a regex to check if the value is possible (we assume that it is checked for accuracy by the board of elections personel since we cannot search a db for it and they already do it)
        searchObj = re.search("^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$",self.SSN) # confirms the social is a possible value
        if (searchObj == None):
            print("invalid social security number")
            return False
        else:
            self.SSN = searchObj.string
            return True

    def main(self): # Main driver for program
        #self.setLogging()
        #logging.info("Start of program")
        print("Creators: Lucas Nagle, Tom Matz, Ryan Harris, and Gerry Pasquale")
        print("Client: Dr. Chad Mourning")
        print("Team: Just-Bobcats")
        #logging.info("printed info")

        #self.getLogin()
        isSSN = Boolean(self.checkSSN)
        while not isSSN:
            #self.getLogin()
            isSSN = Boolean(self.checkSSN)
        #logging.info("Got and checked SSN")
        #logging.info("Finished")      
        return 0

    #def setLogging(self):
        #date = datetime.datetime.date()
        #logging.basicConfig(filename=str(date)+'.log', encoding='utf-8', level=self.LogLvl)
        
#example of how to set up unit tests
""" class Test(unittest.TestCase): 
    "basic class that inherits unittest.TestCase"

    def test_string(self):
        a = "some"
        b = "some"
        self.assertEqual(a,b)

    def test_add(self):
        a = 15
        b = 30
        self.assertEqual(a+15,b) """


    #main method to start code from
if __name__ == "__main__":
    drive = Driver()
    drive.main()
    

    unittest.main() # run the unit tests





              
        

