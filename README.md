
<div align="center">
  <h3> Just Bobcats</h3>
  <h4> ElectionGuard - Secure Voting Software</h4>
  <h5> Project Owner: Chad Mourning </h5>
</div>

------------------


[![Python 3.9](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/downloads/release/python-3100/)
[![React](https://badges.aleen42.com/src/react.svg)](https://github.com/facebook/react)


## Overview
In its current state, the project is capable of logging a user in with address and name validation. A user must be registered to be able to login. Once a user is logged in they are able to access the dynamically created voting page and cast their ballot. Functionality for logging out is also present in the current version. The project also includes an admin/guardians page. Here administrative users are able to start elections and tally running elections. This page is fully independent of the voters page and not accessible by non administrative users.

## Running Instructions
The backend and the frontend should be run seperately.

### Backend

1. Navigate to the <code>backend</code> directory
2. Execute the <code> pip install -r requirements.txt</code> command to ensure all requiremnets are installed
3. Execute the program using <code>python main.py</code> to run the program

### Frontend

1. Navigate to the <code>frontend</code> directory
2. Execute the <code>npm install</code> command to ensuire all requirements are installed
3. Execute the program using <code>npm start</code> to run the program
 
## Change Log

**SPRINT 3** - *11/29/2022*

- Added voter registration logic
- Got ballot and user info to post to database
- Created administrative pages for creating an election and getting a tally from an election
- Wrote election manifest verifiers

**SPRINT 2** - *11/8/2022*

- Updated parameters for login and authentication
- Connected login page to backend using FastAPI
- Setup SQL Models for future database use
- Completed a dynamic voting page for the frontend
- Connected frontend voting page with backend ballot logic

**SPRINT 1** - *10/24/2022*

- Added backend ballot implementation with FastAPI
- Created React template page and sample login page
- Added early stage of login backend system

## Team Members and Roles
- [Lucas Nagle](https://github.com/Ln077218) - Team Leader
- [Tom Matz](https://github.com/tommatz) - Quality Assurance
- [Ryan Harris](https://github.com/C1ickz) - Release Manager
- [Gerry Pasquale](https://github.com/Gerry0191) - Documentation Manager
