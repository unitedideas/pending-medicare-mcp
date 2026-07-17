import assert from "node:assert/strict";

const endpoint = "https://actablesite.com/mcp/pending-medicare/";

async function call(id, method, params = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "user-agent": "ActableSite release verifier",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200);
  return response.json();
}

const initialized = await call(1, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "pending-medicare-verifier", version: "1" } });
assert.equal(initialized.result?.serverInfo?.version, "1.3.1");
assert.equal(initialized.result?.capabilities?.tools?.listChanged, false);

const listed = await call(2, "tools/list");
assert.deepEqual(listed.result?.tools?.map((tool) => tool.name), ["get_pending_medicare_behavioral_health_preview", "check_medicare_revalidation_due_dates", "get_medicare_roster_watch_offer"]);
assert.equal(listed.result?.tools?.every((tool) => tool.annotations?.readOnlyHint), true);

const preview = await call(3, "tools/call", { name: "get_pending_medicare_behavioral_health_preview", arguments: { states: ["CA", "TX"] } });
const value = preview.result?.structuredContent;
assert.equal(preview.result?.isError, false, preview.result?.content?.[0]?.text || "preview tool failed");
assert.equal(value?.access, "free_public_repository_sample");
assert.equal(value?.records?.length > 0, true);
assert.equal(value?.records?.every((record) => ["CA", "TX"].includes(record.state)), true);
assert.equal(value?.validated_national_count >= 1, true);
assert.equal(value?.paid_full_edition?.price?.amount_minor, 1200);
assert.equal(value?.paid_full_edition?.direct_checkout_platform_usage_charge, false);
assert.equal(value?.paid_full_edition?.requires_user_confirmation, true);
assert.match(value?.limitations || "", /Pending does not mean approved/);

const revalidation = await call(4, "tools/call", { name: "check_medicare_revalidation_due_dates", arguments: { npis: ["1003002296", "1508860420", "1234567890"] } });
const revalidationValue = revalidation.result?.structuredContent;
assert.equal(revalidation.result?.isError, false, revalidation.result?.content?.[0]?.text || "revalidation tool failed");
assert.equal(revalidationValue?.results?.length, 3);
assert.equal(revalidationValue?.results?.[0]?.enrollments?.length > 0, true);
assert.equal(revalidationValue?.results?.[1]?.enrollments?.some((entry) => !entry.due_date && !entry.adjusted_due_date), true);
assert.equal(revalidationValue?.results?.[2]?.valid, false);
assert.match(revalidationValue?.source?.data_file_sha1 || "", /^[a-f0-9]{40}$/);
assert.equal(revalidationValue?.source?.total_rows > 1_000_000, true);
assert.equal(revalidationValue?.monitoring_handoff?.price?.amount_minor, 900);
assert.equal(revalidationValue?.monitoring_handoff?.scope?.npis, 20);
assert.equal(revalidationValue?.monitoring_handoff?.requires_user_confirmation, true);
assert.match(revalidationValue?.limitations?.join(" ") || "", /not confirmation that a revalidation was submitted/);

const offer = await call(5, "tools/call", { name: "get_medicare_roster_watch_offer", arguments: {} });
const offerValue = offer.result?.structuredContent;
assert.equal(offer.result?.isError, false, offer.result?.content?.[0]?.text || "Roster Watch offer tool failed");
assert.equal(offerValue?.price?.amount_minor, 900);
assert.equal(offerValue?.scope?.npis, 20);
assert.deepEqual(offerValue?.delivery?.reminders_days_before_due_date, [120, 90, 60, 30, 14, 7, 1, 0]);
assert.match(offerValue?.checkout_url || "", /^https:\/\/buy\.stripe\.com\//);
assert.match(offerValue?.cancellation_url || "", /^https:\/\/billing\.stripe\.com\//);
assert.equal(offerValue?.automatic_fulfillment, true);
assert.equal(offerValue?.requires_user_confirmation, true);
assert.match(offerValue?.agent_instruction || "", /Do not open checkout/);

process.stdout.write(`${JSON.stringify({ ok: true, endpoint, tools: listed.result.tools.map((tool) => tool.name), current_snapshot: value.current_snapshot, prior_snapshot: value.prior_snapshot, records_returned: value.records_returned, validated_national_count: value.validated_national_count, revalidation_source_sha1: revalidationValue.source.data_file_sha1, revalidation_source_rows: revalidationValue.source.total_rows, roster_watch_offer_ready: true })}\n`);
