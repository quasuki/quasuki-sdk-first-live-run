"use strict";

const fs = require("fs");
const path = require("path");
const { createClient, QUASUKI_SDK_NAME, QUASUKI_SDK_VERSION } = require("quasuki-sdk");
const {
  ensureArtifactsDir,
  requireEnv,
  baseUrlFromEnv,
  buildTaskSelection,
  buildBody
} = require("./shared");

async function main() {
  const baseUrl = baseUrlFromEnv();
  const apiKey = requireEnv("QUASUKI_API_KEY");
  const walletId = requireEnv("QUASUKI_WALLET_ID");
  const walletSecret = requireEnv("QUASUKI_WALLET_SECRET");
  const accountId = process.env.QUASUKI_ACCOUNT_ID || "";
  const { taskRef, command } = buildTaskSelection();

  const client = createClient({
    baseUrl,
    apiKey,
    walletId,
    walletSecret,
    accountId
  });

  const body = buildBody(taskRef);
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
    task_ref: payload.task_ref,
    command: payload.command,
    transaction: client.summarizeTransaction(result),
    receipt: client.summarizeReceipt(result),
    command_summary: client.summarizeCommandResult(result).command
  };

  const artifactsDir = ensureArtifactsDir();
  fs.writeFileSync(path.join(artifactsDir, "first-live-run-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(path.join(artifactsDir, "first-live-run-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
