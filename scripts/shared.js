"use strict";

const fs = require("fs");
const path = require("path");

function ensureArtifactsDir() {
  const artifactsDir = path.join(__dirname, "..", "artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });
  return artifactsDir;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function baseUrlFromEnv() {
  return String(process.env.QUASUKI_BASE_URL || "https://console.quasuki.com").replace(/\/$/, "");
}

function buildTaskSelection() {
  const taskRef = process.env.QUASUKI_DEMO_TASK_REF || "zones.list";
  const command = process.env.QUASUKI_DEMO_COMMAND || (taskRef === "admission.preview" ? "preview admission case" : "list zones");
  return { taskRef, command };
}

function buildBody(taskRef) {
  if (taskRef === "admission.preview") {
    return {
      source_zone_id: process.env.QUASUKI_DEMO_SOURCE_ZONE_ID || "sandbox-zone",
      target_zone_id: process.env.QUASUKI_DEMO_TARGET_ZONE_ID || "research-zone",
      interaction_class: process.env.QUASUKI_DEMO_INTERACTION_CLASS || "agent-service",
      artifacts: {
        receipt_types: [process.env.QUASUKI_DEMO_RECEIPT_TYPE || "shoonya_receipt"]
      }
    };
  }
  return null;
}

module.exports = {
  ensureArtifactsDir,
  requireEnv,
  baseUrlFromEnv,
  buildTaskSelection,
  buildBody
};
