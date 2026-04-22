const fs = require("fs");
const path = require("path");

test("Fallback A2UI surface exists and is valid", () => {
  const fallbackPath = path.resolve(
    __dirname,
    "../../docs/ui/a2ui/payloads/fallback/00-unknown-event.json"
  );

  expect(fs.existsSync(fallbackPath)).toBe(true);

  const payload = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
  expect(payload.type).toBe("surface");
  expect(payload.components.length).toBeGreaterThan(0);
});
