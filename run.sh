#!/bin/bash
echo "Activating virtual environment"
source backend/env/bin/activate
(cd backend && python3 main.py) & (cd frontend/guardian && npm start) & (cd frontend/voter && serve -s build/) & (cd frontend/verifier && npm start)