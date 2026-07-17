# Medicare Enrollment and Revalidation Data MCP server

Read the current validated public preview of behavioral-health NPIs newly present in CMS pending first-time Medicare enrollment files, check up to 100 NPIs for public Medicare revalidation due dates, or retrieve the exact Medicare Roster Watch subscription terms. The server is remote, read-only, unauthenticated, and dependency-free for clients.

## Connect

Claude Code:

```bash
claude mcp add --transport http pending-medicare https://actablesite.com/mcp/pending-medicare/
```

For another MCP client, add a Streamable HTTP server using `https://actablesite.com/mcp/pending-medicare/`. No API key or authorization header is required.

### Try it without installing anything

List the live tools:

```bash
curl -sS https://actablesite.com/mcp/pending-medicare/ \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Check public Medicare revalidation dates for one or more NPIs:

```bash
curl -sS https://actablesite.com/mcp/pending-medicare/ \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"check_medicare_revalidation_due_dates","arguments":{"npis":["1003002296"]}}}'
```

Both calls are read-only. They require no account, API key, checkout, or purchase.

Or inspect and connect through the automatically indexed [canonical Glama connector](https://glama.ai/mcp/connectors/io.github.unitedideas/pending-medicare-behavioral-health-provider-enrollment). Glama currently reports the endpoint healthy and exposes its tool schema without requiring a manual submission.

The [MCP Server Spot listing](https://www.mcpserverspot.com/servers/pending-medicare-enrollment-data) provides a public setup guide, exact tool description, compatibility metadata, and the same source and interpretation boundaries.

## Tools

`get_pending_medicare_behavioral_health_preview` returns:

- the current 10-row public sample, optionally filtered by up to 10 two-letter state or territory codes;
- current and prior CMS snapshot dates;
- the validated national record count, state counts, and specialty counts;
- official methodology, the public source receipt, and material limitations; and
- an optional $12 full-edition handoff to the buyer-funded Apify Actor.

The tool cannot create an Apify token, start a run, open checkout, contact an applicant, send data elsewhere, or purchase anything. The full edition remains a separate intentional event; buyer-paid Apify platform usage is separate.

`check_medicare_revalidation_due_dates` returns:

- every current CMS enrollment associated with up to 100 submitted NPIs;
- the established due date, adjusted date, or TBD state for each enrollment;
- provider name, state, enrollment type, specialty, source file revision, and checked time;
- explicit limits separating a public deadline from submission or case status; and
- an optional $9 monthly handoff for change-only monitoring of up to 20 NPIs.

The free lookup remains primary. The monitoring handoff is informational and requires explicit user confirmation before any separate checkout or purchase action. The tool cannot open PECOS, submit a revalidation, upload documents, open checkout, or purchase monitoring.

`get_medicare_roster_watch_offer` returns:

- the exact $9 monthly price and 20-NPI limit;
- the dated baseline, 120/90/60/30/14/7/1/0-day reminder schedule, and change-only delivery contract;
- the public CMS signals checked every 15 minutes;
- the Stripe checkout and cancellation paths, monthly renewal, and automatic-fulfillment expectation; and
- the boundary separating public list evidence from live PECOS or contractor case status.

This is an informational offer tool. It cannot open checkout, subscribe, or purchase. The client must present the price, renewal, scope, delivery, cancellation, and limitations and obtain explicit user confirmation before any separate checkout or purchase action.

## Interpretation boundary

Pending means a first-time Medicare enrollment application is still under Medicare Administrative Contractor review. It does not prove approval, enrollment, billing privileges, credentialing, licensure, a new practice, availability, interest, or buying intent. Public NPPES contact fields may be old, shared, or operational. Verify every record before relying on it.

A public revalidation due date does not prove that a revalidation was submitted, received, accepted, or completed. A TBD result means CMS has not established a due date for that enrollment in the current public list. Use PECOS and the responsible enrollment contractor for official submission and case status.

## Verify

```bash
npm test
npm run verify:live
```

The live verifier initializes the endpoint, confirms the three-tool read-only inventory, retrieves the free preview, revalidation results, and Roster Watch offer, and checks their source dates, counts, price boundaries, delivery, cancellation, and limitations. It does not start a paid run, open checkout, or create a purchase.

## Registry

The server is published through GitHub OIDC as `io.github.unitedideas/pending-medicare-behavioral-health-provider-enrollment`. The release workflow needs no publishing secret.

## License

MIT
