const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const catalogPath = path.resolve(
  __dirname,
  "../../docs/ui/a2ui/catalog/cmx-a2ui-catalog-v1.json"
);

test("CMX A2UI catalog is valid JSON and schemas resolve", () => {
  const ajv = new Ajv({ strict: false });
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

  expect(catalog.catalogId).toBe("cmx-a2ui-catalog-v1");
  expect(catalog.components).toBeDefined();

  for (const ref of Object.values(catalog.components)) {
    const [filePath, schemaPath] = ref["$ref"].split("#");
    const resolved = path.resolve(path.dirname(catalogPath), filePath);

    expect(fs.existsSync(resolved)).toBe(true);

    const schema = JSON.parse(fs.readFileSync(resolved, "utf-8"));
    expect(schemaPath.replace("/", "") in schema).toBe(true);
  }
});
