#!/bin/bash
TRIANGLE_AGENCY="${HOME}/triangle-agency"
UVICORN="${TRIANGLE_AGENCY}/.venv/bin/uvicorn"
ALLOWED_HOSTS="$(whoami).pythonanywhere.com"
CSRF_HOSTS="https://$(whoami).pythonanywhere.com"
${UVICORN} --app-dir ${TRIANGLE_AGENCY} --uds ${DOMAIN_SOCKET} server.asgi:application