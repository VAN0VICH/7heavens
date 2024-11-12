import config from "@/config";
import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

const dev = process.env.NODE_ENV !== "production";
loadEnvConfig(__dirname, dev, { error: console.error, info: () => null });

const projectId = config.sanity.projectId;

export default defineCliConfig({ api: { projectId } });
