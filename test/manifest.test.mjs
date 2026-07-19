import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("registry manifest is a remote-only read-only distribution", async () => {
  const manifest = JSON.parse(await readFile(new URL("../server.json", import.meta.url), "utf8"));
  assert.equal(manifest.$schema, "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json");
  assert.equal(manifest.name, "io.github.unitedideas/pending-medicare-behavioral-health-provider-enrollment");
  assert.equal(manifest.version, "1.3.3");
  assert.equal(manifest.websiteUrl, "https://actablesite.com/medicare-revalidation-mcp-server");
  assert.deepEqual(manifest.remotes, [{ type: "streamable-http", url: "https://actablesite.com/mcp/pending-medicare/" }]);
  assert.equal(manifest.repository.url, "https://github.com/unitedideas/pending-medicare-mcp");
  assert.equal(Object.hasOwn(manifest, "packages"), false);
});

test("documentation preserves the free-to-paid, pending-status, and revalidation boundaries", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /current 10-row public sample/);
  assert.match(readme, /optional \$12 full-edition handoff/);
  assert.match(readme, /buyer-paid Apify platform usage is separate/);
  assert.match(readme, /cannot create an Apify token, start a run, open checkout, contact an applicant/);
  assert.match(readme, /check_medicare_revalidation_due_dates/);
  assert.match(readme, /get_medicare_revalidation_automation_offer/);
  assert.match(readme, /exact \$0\.01 USD price per returned NPI result/);
  assert.match(readme, /https:\/\/mcp\.apify\.com\?tools=actablesite\/medicare-revalidation-lookup-actor/);
  assert.match(readme, /cannot authenticate, create a task, start a run, or purchase/);
  assert.match(readme, /get_medicare_roster_watch_offer/);
  assert.match(readme, /up to 100 submitted NPIs/);
  assert.match(readme, /optional \$9 monthly handoff/);
  assert.match(readme, /exact \$9 monthly price and 20-NPI limit/);
  assert.match(readme, /cannot open checkout, subscribe, or purchase/);
  assert.match(readme, /requires explicit user confirmation/);
  assert.match(readme, /\/api\/medicare-revalidation-rapidapi-referral\?source=mcp_repository_readme/);
  assert.match(readme, /25 requests per month free/);
  assert.match(readme, /\$19 per month for 1,000 requests/);
  assert.match(readme, /hard limits and no soft overages/);
  assert.match(readme, /does not prove that a revalidation was submitted, received, accepted, or completed/);
  assert.match(readme, /does not prove approval, enrollment, billing privileges, credentialing, licensure/);
  assert.match(readme, /https:\/\/www\.mcpserverspot\.com\/servers\/pending-medicare-enrollment-data/);
});
