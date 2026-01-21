#!/bin/bash

# Dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Aliases
alias manage="python3 manage.py"
alias run="python3 manage.py runserver"
alias migrate="python3 manage.py migrate"
alias migrate="python3 manage.py makemigrations "
alias check=".githooks/pre-push"

# Hooks
git config core.hooksPath .githooks