"use strict";

const fs = require("fs");
const path = require("path");
const { createClient, QUASUKI_SDK_NAME, QUASUKI_SDK_VERSION } = require("quasuki-sdk");
const {
  ensureArtifactsDir,
  baseUrlFromEnv,
  buildTaskSelection,
  buildBody
} = require("./shared");

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok || !payload || payload.ok === false) {
    throw new Error(payload && payload.detail ? payload.detail : `request failed: ${response.status}`);
  }
  return payload;
}

async function main() {
  const baseUrl = baseUrlFromEnv();
  const artifactsDir = ensureArtifactsDir();
  const issued = await postJson(`${baseUrl}/v1/agent-accounts`, {
    label: "External SDK First Live Run",
    plan: "instant"
  });
  const { taskRef, command } = buildTaskSelection();
  const body = buildBody(taskRef);
  const client = createClient({
    baseUrl,
    apiKey: issued.onboarding.api_key,
    walletId: issued.account.wallet_id,
    walletSecret: issued.onboarding.wallet_secret,
    accountId: issued.account.account_id
  });
  const payload = {
    command,
    task_ref: taskRef
  };
  if (body !== null) {
    payload.body = body;
  }
  const result = await client.execute(payload);
  const summary = {
    captured_at_iso: new Date().toISOString(),
    sdk_name: QUASUKI_SDK_NAME,
    sdk_version: QUASUKI_SDK_VERSION,
    base_url: baseUrl,
    task_ref: taskRef,
    command,
    onboarding: {
      account_id: issued.account.account_id,
      wallet_id: issued.account.wallet_id,
      plan: issued.account.plan,
      payment_scheme: issued.onboarding.payment_scheme
    },
    transaction: client.summarizeTransaction(result),
    receipt: client.summarizeReceipt(result),
    command_summary: client.summarizeCommandResult(result).command
  };

  fs.writeFileSync(path.join(artifactsDir, "first-live-run-auto-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(path.join(artifactsDir, "first-live-run-auto-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

