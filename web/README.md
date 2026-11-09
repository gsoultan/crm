# Spruce CRM — web UI

React 19 + Mantine 9.7.2 + Tailwind CSS 4 front end for the CRM, sales and marketing modules.
This is a UI prototype with in-memory sample data (`src/data/mock.ts`); there is no backend yet.

## Run it

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## Screens

| Area | Route | What it shows |
| --- | --- | --- |
| Core | `/` | Home: open pipeline, tasks, deals closing this month, pipeline movement |
| Core | `/contacts`, `/contacts/:id` | Contact list with saved views, filters, bulk actions; contact record with timeline and deals |
| Core | `/companies`, `/companies/:id` | Company list (table or cards); account page with people, deals and timeline |
| Core | `/customers`, `/customers/:id` | Existing customers (B2B): revenue trend, last and next expected order, outstanding and overdue invoices, credit; record with orders, invoices, agreements, account plan and product whitespace |
| Sales | `/partners`, `/partners/:id` | Referral and reseller partners: leads referred, sourced pipeline and revenue, commission; partner record with their leads, deals and customers |
| Core | `/activities` | Team timeline, tasks grouped by due date, quick log |
| Sales | `/leads` | Lead inbox, fit + engagement score, convert to contact, company and deal |
| Sales | `/pipeline` | Drag-and-drop Kanban board with weighted totals, table view, deal side panel |
| Sales | `/quotes` | Quote list and editor: catalog lines, discounts, tax, totals |
| Sales | `/forecast` | Won, commit and best case against quota, by month and by rep |
| Marketing | `/segments` | Segment list and rule builder with live match count and preview |

Press `⌘K` anywhere to search contacts, companies and deals.

## How it is put together

- `src/theme.ts` — Mantine theme: spruce green primary, Instrument Sans, component defaults.
- `src/index.css` — Tailwind 4 theme tokens and CSS layer order (`theme, base, mantine, components, utilities`) so Tailwind utilities win over Mantine styles.
- `src/layout/Shell.tsx` — app shell: sidebar navigation, header search (Spotlight), user menu.
- `src/components/ui.tsx` — small shared pieces: page header, avatars, badges, stat card, date helpers.
- `src/pages/*` — one file per screen.

One record model: a company is a prospect, a customer, a partner, or more than one of these at once. Leads, Customers and Partners are views over the same companies and contacts, not separate tables.

Mantine components are used for everything interactive (tables, inputs, drawers, menus, tabs, charts); Tailwind handles layout and spacing.

## Next step

Every open deal, contact and company carries one line: what happens next, when, and who owns it (`src/components/NextStep.tsx`). It reads the earliest open task or upcoming meeting linked to the record. When there is none, the line turns amber with a Plan button. Moving a deal to a new stage, completing a task from a deal, or pressing Plan opens the "What's next?" prompt with stage-specific suggestions; the answer becomes a task linked to the deal.
