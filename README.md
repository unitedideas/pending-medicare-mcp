# Pending Medicare Enrollment Data MCP server

Read the current validated public preview of behavioral-health NPIs newly present in CMS pending first-time Medicare enrollment files. The server is remote, read-only, unauthenticated, and dependency-free for clients.

## Connect

Claude Code:

```bash
claude mcp add --transport http pending-medicare https://actablesite.com/mcp/pending-medicare
```

For another MCP client, add a Streamable HTTP server using `https://actablesite.com/mcp/pending-medicare`. No API key or authorization header is required.

Or inspect and connect through the automatically indexed [Glama connector](https://glama.ai/mcp/connectors/io.github.unitedideas/pending-medicare-enrollment-data). Glama currently reports the endpoint healthy and exposes its tool schema without requiring a manual submission.

The [MCP Server Spot listing](https://www.mcpserverspot.com/servers/pending-medicare-enrollment-data) provides a public setup guide, exact tool description, compatibility metadata, and the same source and interpretation boundaries.

## Tool

`get_pending_medicare_behavioral_health_preview` returns:

- the current 10-row public sample, optionally filtered by up to 10 two-letter state or territory codes;
- current and prior CMS snapshot dates;
- the validated national record count, state counts, and specialty counts;
- official methodology, the public source receipt, and material limitations; and
- an optional $12 full-edition handoff to the buyer-funded Apify Actor.

The tool cannot create an Apify token, start a run, open checkout, contact an applicant, send data elsewhere, or purchase anything. The full edition remains a separate intentional event; buyer-paid Apify platform usage is separate.

## Interpretation boundary

Pending means a first-time Medicare enrollment application is still under Medicare Administrative Contractor review. It does not prove approval, enrollment, billing privileges, credentialing, licensure, a new practice, availability, interest, or buying intent. Public NPPES contact fields may be old, shared, or operational. Verify every record before relying on it.

## Verify

```bash
npm test
npm run verify:live
```

The live verifier initializes the endpoint, confirms the one-tool read-only inventory, retrieves the free preview, and checks its source dates, counts, price boundary, and limitations. It does not start a paid run or create a purchase.

## Registry

The server is published through GitHub OIDC as `io.github.unitedideas/pending-medicare-behavioral-health-provider-enrollment`. The release workflow needs no publishing secret.

## License

MIT
