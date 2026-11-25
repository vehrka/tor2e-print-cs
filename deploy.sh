#!/usr/bin/env bash
# Deploy the runtime files to a remote Foundry data dir.
# Target from DEPLOY_TARGET (env or .env), e.g. host:path/Data/modules/tor2eprint
# Extra args go to rsync, e.g. ./deploy.sh -n for a dry run.
set -euo pipefail
cd "$(dirname "$0")"

if [[ -z "${DEPLOY_TARGET:-}" && -f .env ]]; then
  DEPLOY_TARGET="$(sed -n 's/^[[:space:]]*DEPLOY_TARGET[[:space:]]*=[[:space:]]*//p' .env | tail -n1 | tr -d "\"'")"
fi
: "${DEPLOY_TARGET:?Set DEPLOY_TARGET (env or .env), e.g. host:path/Data/modules/tor2eprint}"

rsync -azP --delete "$@" \
  --include='module.json' --include='tor2eprint.mjs' --include='modules/***' --include='fonts/***' \
  --include='templates/***' --include='styles/***' --include='lang/***' --exclude='*' \
  ./ "${DEPLOY_TARGET%/}/"
