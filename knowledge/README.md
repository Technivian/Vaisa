# VONROC Knowledge Base (Demo)

This knowledge base is used to populate an OpenAI vector store so the
assistant answers with File Search instead of inventing answers.

Unlike the very first version of this demo, the content here is sourced
from VONROC's actual public pages (vonroc.nl, vonroc.freshdesk.com,
vonroc.be), not invented. Each file states its source page and the date it
was retrieved. This is still demo content, not a live feed — if VONROC
changes a policy or a spec, these files will go stale until someone
updates them; they are not pulled live at runtime.

## Structure

```text
knowledge/
├── returns.md               general return policy
├── shipping.md               carriers, costs, delivery timelines
├── warranty.md                warranty terms (customer-facing + legal)
├── product-registration.md     how to register, extra-warranty benefit
├── batteries.md                 12V vs 20V platform compatibility rules
├── contact.md                    human support channels and hours
├── troubleshooting.md             troubleshooting logic grounded in the
│                                   3 products below
└── products/
    ├── CD510DC.md                cordless drill — full spec sheet
    ├── CD511DC.md                PRO cordless drill (brushless) — spec sheet
    └── RH501DC.md                rotary hammer — spec sheet
```

Only 3 products are documented in this POC (on purpose — see the main
project brief's scope control). Ask the assistant about a different
VONROC product and it should say it doesn't have that information rather
than guessing, since it isn't in this knowledge base.

## Writing style

Facts only — no marketing copy, no reviews, no navigation/SEO text, no
assumptions. Every file starts with its source page and retrieval date so
staleness is easy to check later.

## Updating this knowledge base

1. Edit or add Markdown files here (subfolders are fine — the upload
   script reads recursively).
2. Run `npm run upload-knowledge` (needs `OPENAI_API_KEY` set).
3. Copy the printed vector store ID into `OPENAI_VECTOR_STORE_ID` in
   `.env.local` and restart the dev server.

See the main [README](../README.md) for full setup instructions.
