/**
 * Dev entry run via: node --import tsx scripts/dev.mjs
 * Avoids cross-env.cmd / tsx.cmd on Windows so Ctrl+C exits without
 * "Terminate batch job (Y/N)?".
 */
process.env.NODE_ENV = "development";
await import("../server/index.ts");
