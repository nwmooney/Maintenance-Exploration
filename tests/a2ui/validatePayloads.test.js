const fs = require("fs");
const path = require("path");
const glob = require("glob");

const catalog = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../../docs/ui/a2ui/catalog/cmx-a2ui-catalog-v1.json"
    ),
    "utf-8"
  )
);

const allowedComponents = new Set(Object.keys(catalog.components));

const payloadFiles = glob.sync(
  path.resolve(__dirname, "../../docs/ui/a2ui/payloads/**/*.json")
);

test("All A2UI payloads use only catalog-approved components", () => {
  payloadFiles.forEach((file) => {
    const payload = JSON.parse(fs.readFileSync(file, "utf-8"));

    expect(payload.type).toBe("surface");
    expect(Array.isArray(payload.components)).toBe(true);

    payload.components.forEach((component) => {
      expect(allowedComponents.has(component.type)).toBe(true);
    });
  });
});
