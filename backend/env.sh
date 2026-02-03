#!/bin/bash

# Dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Aliases

# Manage command prefix
alias manage="python3 manage.py"
# Runs the server. In most cases, you should instead use the vscode launcher.json settings.
alias run="python3 manage.py runserver"
# applies migrations to the database
alias migrate="python3 manage.py migrate"
# creates new migration files based on the changes detected in your models
alias makemigrations="python3 manage.py makemigrations"
# displays the SQL statements for a migration. 
alias sqlmigrate="python3 manage.py sqlmigrate"
# lists a project’s migrations and their status.
alias showmigrations="python3 manage.py showmigrations"
# Opens up a shell.
alias shell="python3 manage.py shell"
#Runs pre-push checks
alias check=".githooks/pre-push"

# Hooks
git config core.hooksPath .githooks