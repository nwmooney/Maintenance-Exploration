const fs = require("fs");
const path = require("path");
const glob = require("glob");

const catalogPath = path.resolve(
  __dirname,
  "../../docs/ui/a2ui/catalog"
);

const schemas = {};
fs.readdirSync(path.join(catalogPath, "components")).forEach((file) => {
  const content = JSON.parse(
    fs.readFileSync(path.join(catalogPath, "components", file), "utf-8")
  );
  Object.assign(schemas, content);
});

const payloadFiles = glob.sync(
  path.resolve(__dirname, "../../docs/ui/a2ui/payloads/**/*.json")
);

test("All components satisfy required schema fields", () => {
  payloadFiles.forEach((file) => {
    const payload = JSON.parse(fs.readFileSync(file, "utf-8"));

    payload.components.forEach((component) => {
      const schema = schemas[component.type];
      expect(schema).toBeDefined();

      if (schema.required) {
        schema.required.forEach((field) => {
          expect(component[field]).toBeDefined();
        });
      }
    });
  });
});
