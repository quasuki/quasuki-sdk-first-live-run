"use strict";

const fs = require("fs");
const path = require("path");
const { createClient, QUASUKI_SDK_NAME, QUASUKI_SDK_VERSION } = require("quasuki-sdk");
const { ensureArtifactsDir, baseUrlFromEnv } = require("./shared");

async function main() {
  const baseUrl = baseUrlFromEnv();
  const client = createClient({ baseUrl });
  const catalog = await client.fetchCatalog();
  const tasks = Array.isArray(catalog && catalog.tasks) ? catalog.tasks : [];
  const categories = Array.isArray(catalog && catalog.task_categories) ? catalog.task_categories : [];
  const summary = {
    captured_at_iso: new Date().toISOString(),
    sdk_name: QUASUKI_SDK_NAME,
    sdk_version: QUASUKI_SDK_VERSION,
    base_url: baseUrl,
    catalog_version: catalog && (catalog.catalog_version || catalog.version) ? (catalog.catalog_version || catalog.version) : null,
    task_count: tasks.length,
    task_categories: categories,
    sample_task_refs: tasks.slice(0, 8).map((task) => task.public_task_ref || task.task_ref),
    live_task_ref: "zones.list",
    live_task_present: tasks.some((task) => task && ((task.public_task_ref || task.task_ref) === "zones.list" || task.task_ref === "naxytra.zones.list"))
  };

  const artifactsDir = ensureArtifactsDir();
  fs.writeFileSync(path.join(artifactsDir, "catalog-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
