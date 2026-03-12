# Quasuki SDK First Live Run

Standalone external-consumer demo repo for `quasuki-sdk@0.2.5`.

This repo is intentionally outside the Quasuki workspace repos so it proves a real npm consumer path rather than an internal file-reference path.

## What It Proves

- install `quasuki-sdk@0.2.5` from npm
- fetch the live Quasuki catalog from `https://console.quasuki.com`
- execute one real paid task through the published SDK
- save reproducible JSON artifacts under `artifacts/`

## Exact Install

Package install from a blank Node project:

```bash
npm install quasuki-sdk@0.2.5
```

Repo install:

```bash
npm install
```

## Exact Environment

Required for catalog fetch:

- `QUASUKI_BASE_URL`

Required for the live paid task:

- `QUASUKI_BASE_URL`
- `QUASUKI_API_KEY`
- `QUASUKI_WALLET_ID`
- `QUASUKI_WALLET_SECRET`

Optional:

- `QUASUKI_ACCOUNT_ID`
- `QUASUKI_DEMO_TASK_REF`
- `QUASUKI_DEMO_COMMAND`
- `QUASUKI_DEMO_SOURCE_ZONE_ID`
- `QUASUKI_DEMO_TARGET_ZONE_ID`
- `QUASUKI_DEMO_INTERACTION_CLASS`
- `QUASUKI_DEMO_RECEIPT_TYPE`

PowerShell example:

```powershell
$env:QUASUKI_BASE_URL="https://console.quasuki.com"
$env:QUASUKI_API_KEY="replace-with-api-key"
$env:QUASUKI_WALLET_ID="replace-with-wallet-id"
$env:QUASUKI_WALLET_SECRET="replace-with-wallet-secret"
$env:QUASUKI_DEMO_TASK_REF="zones.list"
$env:QUASUKI_DEMO_COMMAND="list zones"
$env:QUASUKI_DEMO_SOURCE_ZONE_ID="sandbox-zone"
$env:QUASUKI_DEMO_TARGET_ZONE_ID="research-zone"
$env:QUASUKI_DEMO_INTERACTION_CLASS="agent-service"
$env:QUASUKI_DEMO_RECEIPT_TYPE="shoonya_receipt"
```

## Exact Commands

Catalog fetch:

```bash
npm run catalog
```

First live paid run:

```bash
npm run first-live-run
```

One-command self-serve onboarding plus paid run:

```bash
npm run first-live-run:auto
```

## Default Live Task

The paid run executes:

- `task_ref`: `zones.list`
- `command`: `list zones`

Default request body:

```json
{}
```

Optional richer task:

- `task_ref`: `admission.preview`
- `command`: `preview admission case`

Admission preview body:

```json
{
  "source_zone_id": "sandbox-zone",
  "target_zone_id": "research-zone",
  "interaction_class": "agent-service",
  "artifacts": {
    "receipt_types": ["shoonya_receipt"]
  }
}
```

## Artifacts

Successful runs write:

- `artifacts/catalog-summary.json`
- `artifacts/first-live-run-summary.json`
- `artifacts/first-live-run-result.json`
- `artifacts/first-live-run-auto-summary.json`
- `artifacts/first-live-run-auto-result.json`

The auto-onboard path stores account and wallet ids, but it does not persist `api_key` or `wallet_secret`.

## Public References

- npm package: `https://www.npmjs.com/package/quasuki-sdk`
- repository: `https://github.com/quasuki/quasuki-sdk`
- release: `https://github.com/quasuki/quasuki-sdk/releases/tag/v0.2.5`
