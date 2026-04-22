const fs = require("fs");
const path = require("path");

test("Fallback telemetry emitter exists", () => {
  const telemetryPath = path.resolve(
    __dirname,
    "../../src/agent/telemetry/emitTelemetry.ts"
  );
  expect(fs.existsSync(telemetryPath)).toBe(true);
});

test("Fallback payload is referenced in runtime bundle", () => {
  const bundle = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../dist/a2ui/cmx-a2ui-runtime-bundle-v1.json"),
      "utf-8"
    )
  );

  expect(bundle.fallback).toBeDefined();
  expect(bundle.fallback.payload).toContain("fallback");
});
