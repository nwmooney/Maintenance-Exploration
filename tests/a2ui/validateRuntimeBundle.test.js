const fs = require("fs");
const path = require("path");

const bundlePath = path.resolve(
  __dirname,
  "../../dist/a2ui/cmx-a2ui-runtime-bundle-v1.json"
);

test("Runtime bundle references valid payload files", () => {
  const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf-8"));

  Object.values(bundle.payloads).forEach((group) => {
    group.forEach((entry) => {
      const payloadPath = path.resolve(__dirname, "../../", entry.payload);
      expect(fs.existsSync(payloadPath)).toBe(true);
    });
  });
});
