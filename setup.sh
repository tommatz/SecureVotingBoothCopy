#!/bin/bash
BACKEND_IP=""
# Checks if network flag is set and sets backend ip appropriately
if [ "$1" = "-n" ]; then
    BACKEND_IP=$(python3 -c "import socket; print(socket.gethostbyname(socket.gethostname()))")
else
    BACKEND_IP="localhost"
fi
echo "Settting route between frontend and backend"
echo "Backend IP=$BACKEND_IP"

# Writes backend ip to each seperate frontend app in formatt {"ip" : "ip_addr"}
echo "Writing to guardian"
echo "{ \"ip\" : \"${BACKEND_IP}\"}"> frontend/guardian/src/constants/backend_ip.json
echo "Writing to voter"
echo "{ \"ip\" : \"${BACKEND_IP}\"}" > frontend/voter/src/constants/backend_ip.json
echo "Writing to verifier"
echo "{ \"ip\" : \"${BACKEND_IP}\"}" > frontend/verifier/src/constants/backend_ip.json

echo "Creating virtual environment"
python3 -m venv backend/env
echo "Activating virtual environment"
source backend/env/bin/activate
echo "Downloading python requirements"
(cd backend && ./setup_backend.sh)