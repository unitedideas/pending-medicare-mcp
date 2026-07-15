import assert from "node:assert/strict";

const endpoint = "https://actablesite.com/mcp/pending-medicare";

async function call(id, method, params = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "user-agent": "Pending Medicare MCP release verifier",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200);
  return response.json();
}

const initialized = await call(1, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "pending-medicare-verifier", version: "1" } });
assert.equal(initialized.result?.serverInfo?.version, "1.1.1");
assert.equal(initialized.result?.capabilities?.tools?.listChanged, false);

const listed = await call(2, "tools/list");
assert.deepEqual(listed.result?.tools?.map((tool) => tool.name), ["get_pending_medicare_behavioral_health_preview"]);
assert.equal(listed.result?.tools?.[0]?.annotations?.readOnlyHint, true);

const preview = await call(3, "tools/call", { name: "get_pending_medicare_behavioral_health_preview", arguments: { states: ["CA", "TX"] } });
const value = preview.result?.structuredContent;
assert.equal(preview.result?.isError, false, preview.result?.content?.[0]?.text || "preview tool failed");
assert.equal(value?.access, "free_public_repository_sample");
assert.equal(value?.records?.length > 0, true);
assert.equal(value?.records?.every((record) => ["CA", "TX"].includes(record.state)), true);
assert.equal(value?.validated_national_count >= 1, true);
assert.equal(value?.paid_full_edition?.price?.amount_minor, 1200);
assert.equal(value?.paid_full_edition?.buyer_paid_platform_usage_is_separate, true);
assert.equal(value?.paid_full_edition?.requires_user_confirmation, true);
assert.match(value?.limitations || "", /Pending does not mean approved/);

process.stdout.write(`${JSON.stringify({ ok: true, endpoint, tools: listed.result.tools.map((tool) => tool.name), current_snapshot: value.current_snapshot, prior_snapshot: value.prior_snapshot, records_returned: value.records_returned, validated_national_count: value.validated_national_count })}\n`);
