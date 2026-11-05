# Clearline Family — MCP server

This folder holds the source of Clearline Family's MCP (Model Context Protocol) server: an **education-only** life insurance coverage-gap calculator for Washington families.

- **Live endpoint:** https://mcp.clearlinefamily.com/mcp (streamable HTTP)
- **Site:** https://clearlinefamily.com
- **Listed in:** the official MCP Registry as `com.clearlinefamily/clearline-family`; submitted to the ChatGPT plugin directory on Nov 4, 2026.
- **Registry listing source:** `server.json` is maintained with the fleet's registry records; the listing points back to this repository.

## What it does

The server exposes exactly one tool:

- **`check_coverage_gap`** (read-only) — takes a household's income, debts, savings, existing coverage, and goals, and returns an estimated life insurance coverage gap with the math shown line by line. It teaches how coverage needs are calculated; it does not recommend products, name carriers or policies, or tell anyone what to buy. Nothing is stored — the server is stateless by design.

## File map

| File | What it is |
|---|---|
| `src/worker.mjs` | The Cloudflare Worker: MCP transport (initialize / tools/list / tools/call), the `/.well-known/openai-apps-challenge` verification route, and the icon route. |
| `src/engine.mjs` | The coverage-gap calculation engine — the same math the clearlinefamily.com site calculator runs, with public sources (WA OIC, WA DOR, RCW, IRS) cited in the data. |
| `src/icon.mjs` | The server's 512×512 icon, served by the worker at `/icon.png`. |
| `wrangler.toml` | Worker configuration (name, entry point, compatibility date). No bindings; the domain-verification token is set as a worker secret at deploy time and never appears in this repo. |

## Intentionally not published

- `src/demo.mjs` — a generated demo-video module (a ~400 KB encoded walkthrough asset), omitted as build output rather than source.
- The internal deploy script — it drives a private credential helper and has no place in a public repo. Deployment is a standard `wrangler deploy` of this folder for anyone running their own copy.
