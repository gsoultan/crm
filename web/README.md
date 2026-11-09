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

Mantine components are used for everything interactive (tables, inputs, drawers, menus, tabs, charts); Tailwind handles layout and spacing.
