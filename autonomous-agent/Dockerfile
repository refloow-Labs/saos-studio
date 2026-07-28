# SAOS Autonomous Agent — one runtime for everyone (macOS + Windows).
#
# Why this exists (see DOCKER.md for the Greek write-up):
#   - sqlite3 is a native module. A binary built on macOS fails on Windows
#     ("not a valid Win32 application") and vice versa. Building it inside
#     this image means every teammate runs the exact same binary.
#   - The QA gate needs a real Chromium (previously installed per-machine
#     under .claude/skills/playwright-skill/node_modules). It's baked in here.
#   - node_modules is git-tracked in this repo; npm on Windows rewrites it
#     with CRLF line endings. Installing inside the container means nobody's
#     local `npm install` ever needs to touch that tracked tree again.

FROM node:22-bookworm-slim

# The agent's cron fires at 09:00 local time — a UTC container would fire at
# the wrong hour, so bake in the timezone explicitly.
ENV TZ=Europe/Athens \
    NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata ca-certificates \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Optional extra CA certificates, for anyone behind TLS-intercepting software
# (antivirus like Norton, or a corporate proxy). Drop a `.crt` into certs/ and
# it is ADDED to the trust store — we never disable certificate verification.
# The folder is empty by default, so this is a no-op on normal machines.
COPY certs/ /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app

# Layer-cache dependencies: only re-run npm ci when package*.json actually
# changes, not on every source edit.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# OS-level libraries Chromium needs. Version-insensitive and rarely changes, so
# it stays in its own cacheable layer. The browser BINARIES are downloaded later,
# by the skill's own playwright, so their build number always matches.
RUN npx playwright@1.57.0 install-deps chromium

# Now bring in the rest of the source.
COPY . .

# The QA gate's browser layer runs through .claude/skills/playwright-skill/run.js,
# which chdir's into that folder and require()s 'playwright' from there. Its
# node_modules is .dockerignore'd (host binaries are platform-specific), so
# install the Linux build here — otherwise the browser layer silently skips.
# Install the browser binaries with THIS playwright, not a pinned one: the skill
# declares `playwright: ^1.57.0`, so npm may resolve a newer minor whose expected
# Chromium build number differs. Downloading via the locally installed version
# keeps the two in lockstep.
RUN cd .claude/skills/playwright-skill \
    && npm install --omit=dev --no-audit --no-fund \
    && npx playwright install chromium

# Run as a non-root user, but make sure the dirs it needs to write to
# (SQLite state + the mounted crm/ folder for generated drafts) are owned by it.
RUN mkdir -p /app/data /crm/agent-drafts \
    && chown -R node:node /app /crm /ms-playwright

USER node

# Safe to run at container-start time: prints config and exits without
# touching the network or the DB (see src/agent.js --check-config branch).
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node src/agent.js --check-config || exit 1

CMD ["node", "src/agent.js"]
