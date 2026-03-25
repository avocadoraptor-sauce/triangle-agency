# AGENTS.md

This repository is a Django backend with a React frontend bundled by webpack and served by Django.

## Repo Map

- `server/`: Django app, settings, views, models, routing, and websocket/backend logic.
- `src/`: React + TypeScript frontend source.
- `static/`: Static assets and generated frontend build artifacts committed for deployment.
- `gen/`: Generated TypeScript types and related generated code.
- `specs/`: JSON specs describing intended data models.
- `data/`: Django fixture data used to seed local development.
- `manage.py`: Django management entrypoint.
- `env.sh`: Local bootstrap script for Python, Node, fixtures, aliases, and git hooks.
- `release.sh`: Production release helper that creates a release worktree and commits built assets.

## Local Setup

From the repo root:

```bash
source env.sh
```

What this does:

- creates and activates `.venv`
- installs Python dependencies from `requirements.txt`
- applies Django migrations
- loads fixture data from `/data`
- configures Node inside the virtualenv and installs frontend dependencies
- installs git hooks from `.githooks`

## Common Commands

Backend:

```bash
python3 manage.py runserver
python3 manage.py migrate
python3 manage.py makemigrations
```

Frontend:

```bash
npm run pack
npx webpack --mode=development
npm test -- --watch=false
```

Generated types:

```bash
npm run gentypes
```

Notes:

- `npm run gentypes` expects the Django app to be running locally so `http://localhost:8000/api/openapi.json` is available.
- The documented frontend workflow uses webpack directly rather than a separate frontend dev server.

## Working Agreement For Agents

- Prefer small, targeted changes that preserve the current Django + React + webpack flow.
- Treat `static/` and `webpack-stats.json` as build outputs unless the task is explicitly about release artifacts.
- If backend change in `server/`: 
    - If API change in `server/views.py`: regenerate types in `gen/` with `npm run gentypes`.
    - If model change in `server/models.py`: run `makemigrations` and `migrate` to update the Django models
- Keep generated or derived changes separate from handwritten logic where practical.
- Do not rewrite deployment flow unless the task explicitly calls for it; the current release process depends on committed build artifacts.

## Validation
# TBD

## Cautions

- `env.sh` is not idempotent in the strict sense; it installs dependencies and loads fixture data as part of setup.
- `release.sh` creates a new git worktree and pushes a release branch; do not run it as part of routine local validation.
- The root `README.md` is duplicated under `triangle-agency/README.md`; if updating contributor docs, keep both in sync unless one copy is intentionally being retired.
