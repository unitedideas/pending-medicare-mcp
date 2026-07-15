import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("registry manifest is a remote-only read-only distribution", async () => {
  const manifest = JSON.parse(await readFile(new URL("../server.json", import.meta.url), "utf8"));
  assert.equal(manifest.$schema, "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json");
  assert.equal(manifest.name, "io.github.unitedideas/pending-medicare-enrollment-data");
  assert.equal(manifest.version, "1.0.1");
  assert.deepEqual(manifest.remotes, [{ type: "streamable-http", url: "https://actablesite.com/mcp/pending-medicare" }]);
  assert.equal(manifest.repository.url, "https://github.com/unitedideas/pending-medicare-mcp");
  assert.equal(Object.hasOwn(manifest, "packages"), false);
});

test("documentation preserves the free-to-paid and pending-status boundaries", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /current 10-row public sample/);
  assert.match(readme, /optional \$12 full-edition handoff/);
  assert.match(readme, /buyer-paid Apify platform usage is separate/);
  assert.match(readme, /cannot create an Apify token, start a run, open checkout, contact an applicant/);
  assert.match(readme, /does not prove approval, enrollment, billing privileges, credentialing, licensure/);
});
