#!/bin/bash
TRIANGLE_AGENCY="${HOME}/triangle-agency"
UVICORN="${TRIANGLE_AGENCY}/.venv/bin/uvicorn"
${UVICORN} --app-dir ${TRIANGLE_AGENCY} --uds ${DOMAIN_SOCKET} server.asgi:application