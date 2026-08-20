# VONROC AI Customer Service Agent — Concept Demo

An AI customer service assistant proof of concept built for VONROC, a brand
of PTH Global. It answers customer questions using a VONROC knowledge base,
looks up simulated orders, helps troubleshoot common product issues,
automatically detects and replies in the customer's language, and escalates
complex or unsafe cases to a human colleague with a structured handoff
summary.

**This is an independent proof of concept and is not an official VONROC or
PTH Global product.**

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- **Two interchangeable AI providers**, selected by `AI_PROVIDER`:
  - OpenAI Node SDK — **Responses API** with function tools + File Search
  - Google `@google/genai` SDK — Gemini function calling + File Search
- Local JSON files for simulated orders and escalations (no database)
- Plain server-side API route (`app/api/chat/route.ts`) — no external
  backend services

Both providers share the exact same business logic — order lookup rules,
escalation handling, tool schemas, the system prompt, and the customer
UI/dashboard are all provider-agnostic. Only the model-calling loop differs
(`lib/providers/openaiProvider.ts` vs `lib/providers/geminiProvider.ts`).

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
AI_PROVIDER=

OPENAI_API_KEY=sk-...
OPENAI_VECTOR_STORE_ID=
OPENAI_MODEL=

GEMINI_API_KEY=
GEMINI_FILE_SEARCH_STORE_NAME=
GEMINI_MODEL=
```

- `AI_PROVIDER` — `openai` or `gemini`. **Defaults to `gemini` if left
  blank** (this demo's current default backend). Set it to `openai` to
  switch back once that account has credits again.
- `OPENAI_API_KEY` / `GEMINI_API_KEY` — required for the corresponding
  provider to actually chat. Without the key the active provider's is
  using, the app still runs and shows a clear "not configured" message
  instead of crashing.
- `OPENAI_VECTOR_STORE_ID` / `GEMINI_FILE_SEARCH_STORE_NAME` — required
  for that provider's File Search (returns, shipping, warranty, batteries,
  troubleshooting, etc). Without it, the assistant still works for
  orders/escalation, but has no knowledge base to search.
- `OPENAI_MODEL` — optional, defaults to `gpt-4.1-mini`.
- `GEMINI_MODEL` — optional, defaults to `gemini-3.5-flash`.

You only need to fill in the section for the provider(s) you intend to use.

## Knowledge base setup (File Search)

1. Knowledge files already exist in [`/knowledge`](knowledge) (returns,
   shipping, warranty, product registration, batteries, contact,
   troubleshooting, plus per-product spec sheets in `knowledge/products/`).
   Edit or add files there if you want to change what the assistant can
   answer.
2. Run the upload script (needs `OPENAI_API_KEY` and/or `GEMINI_API_KEY`
   set, e.g. in `.env.local`):

   ```bash
   npm run upload-knowledge
   ```

3. The script uploads and indexes the knowledge files into a File Search
   store for every provider that has an API key set, and prints the
   resulting ID(s).
4. Copy whichever value(s) it prints into `.env.local`:

   ```env
   OPENAI_VECTOR_STORE_ID=vs_...
   GEMINI_FILE_SEARCH_STORE_NAME=fileSearchStores/...
   ```

5. Restart `npm run dev` so the new environment variable(s) are picked up.

## Start

```bash
npm run dev
```

Open <http://localhost:3000> for the customer chat, and
<http://localhost:3000/dashboard> for the simulated employee dashboard.

## Demo credentials

There is no authentication in this proof of concept — both pages are open.

## Demo scenarios

These five conversations are the ones this POC is built and tested to
handle reliably. Try them in the chat at `/`:

1. **Order tracking (Dutch)** — "Waar is mijn bestelling?" → the assistant
   asks for the order number, then the postal code, then looks it up.
   Demo order: `VON-2026-10421`, postcode `3011AA` (shown discreetly under
   "Demo info (for presenter)" in the chat footer).
2. **Returns** — "Ik wil mijn bestelling retourneren." → the assistant
   explains the return procedure using File Search (requires
   `OPENAI_VECTOR_STORE_ID` to be configured).
3. **Product problem** — "Mijn CD510DC accuboormachine stopt steeds." →
   the assistant asks basic troubleshooting questions, then escalates to a
   human colleague if unresolved. Try also: "Mijn CD510DC boort niet door
   beton" — the assistant should explain that's expected (the CD510DC
   isn't rated for concrete) and point to the RH501DC instead, rather than
   treating it as a fault.
4. **Battery compatibility** — "Welke accu heb ik nodig voor de RH501DC?"
   → the assistant answers from the knowledge base (VPower 20V, 2.0Ah or
   4.0Ah) rather than guessing. If the model isn't given, it should ask
   for it first — the knowledge base only documents the CD510DC, CD511DC
   and RH501DC in this POC, so asking about another product should get an
   honest "I don't have that" instead of a fabricated answer.
5. **German customer** — "Meine Maschine funktioniert nicht mehr." → the
   assistant continues in German automatically, no language selector
   needed. English and French work the same way.

Every escalation created during a demo shows up immediately on
`/dashboard`, with a full structured handoff (language, issue,
classification, urgency, recommended action, and transcript) — a human
colleague never has to make the customer repeat themselves.

Use the **Reset Demo** button in the chat to clear the conversation between
takes.

## Deploying on Replit

This app has no native/OS-specific dependencies, so it runs on Replit's
Node.js template as-is:

1. Import this repository into Replit.
2. Add `AI_PROVIDER` plus the key(s)/store ID(s) for whichever provider(s)
   you're using (`OPENAI_API_KEY` + `OPENAI_VECTOR_STORE_ID`, and/or
   `GEMINI_API_KEY` + `GEMINI_FILE_SEARCH_STORE_NAME`) as Replit Secrets.
3. Set the run command to `npm install && npm run dev -- -H 0.0.0.0 -p $PORT`
   so Next.js binds to the port Replit exposes.

Escalations are stored in the browser's localStorage (see "Escalation
persistence" below), not on the server, so this works identically on
Replit and on stateless hosts like Vercel.

## Project structure

```text
app/
  page.tsx              customer chat page
  dashboard/page.tsx     employee dashboard shell (server component)
  api/chat/route.ts      Responses API + tool-calling route (server-only)
components/               Chat, Message, QuickActions, HandoffCard,
                           DashboardMetrics, ConversationPanel,
                           DashboardClient (reads localStorage)
lib/
  openai.ts               OpenAI client + model/vector-store config
  gemini.ts                Gemini client + model/file-search-store config
  agentPrompt.ts            system prompt / agent behaviour rules (shared)
  toolSchemas.ts             tool JSON Schemas, shared by both providers
  tools.ts                   OpenAI-format tool builder + tool execution
                              (lookup_order, escalate_case — shared)
  providers/
    index.ts                  AI_PROVIDER selection
    openaiProvider.ts          OpenAI Responses API tool-calling loop
    geminiProvider.ts          Gemini function-calling loop
  orders.ts                 order lookup logic (shared)
  escalation.ts              builds escalation records + simulated KPIs
                              (pure — no persistence; see below)
  clientEscalations.ts       browser localStorage read/write/dedupe
data/
  orders.json               5 fictional demo orders
knowledge/                  Markdown knowledge base for File Search
scripts/
  upload-knowledge.ts       creates/populates the vector store
tests/                      vitest unit + route tests
```

## Escalation persistence

`escalate_case` builds a structured escalation record server-side but does
**not** write it to disk — Vercel's serverless functions have no durable
or shared filesystem across invocations, so any server-side file store
either fails outright or silently disappears between requests. Instead,
the full escalation record is returned in the `/api/chat` response, and
the browser saves it to `localStorage` under the key `vaisa_escalations`
(deduped by id, newest first). The `/dashboard` page reads from the same
key on the client (via `useSyncExternalStore`, so there's no SSR/hydration
mismatch) — open it in the same browser that ran the chat to see the case.
**Escalations are per-browser, not shared across devices or employees** —
fine for a live demo, not for production. "Reset Demo" clears both the
chat and `vaisa_escalations`.

## Testing

```bash
npm test        # vitest — order lookup, escalation, tool execution, chat route
npm run lint     # eslint
npx tsc --noEmit # type check
```

Automated tests cover deterministic logic: order lookup (including postal
code verification and not-found handling), escalation record construction
and the simulated KPI counters, the browser localStorage store (dedup by
id, newest-first ordering, malformed/empty content handled safely, SSR
no-`window` safety), tool execution (including malformed arguments), and
the `/api/chat` tool-calling loop for **both** providers (order lookup
round trip, escalation round trip with the full escalation record in the
response, missing-API-key graceful degradation, and upstream failure
handling) using mocked OpenAI/Gemini clients.

Actual multilingual replies and File Search answers depend on a live
API call and are verified manually against the running app; they are not
part of the automated suite since they are non-deterministic.

## Notes on scope

This is a **sales proof of concept**, not a production system. Order data
is a local JSON file and escalations live in browser localStorage — no
authentication, no external integrations (no WhatsApp, no Zendesk, no
CRM), and no database. Escalations are per-browser and disappear if the
user clears site data — enough for a live demo, not enough for production
use.
