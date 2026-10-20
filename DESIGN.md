# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person A, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

`A lasting sense of regality, homeliness and calmness.`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- `https://cf-my.sharepoint.com/:i:/g/personal/ohuabunwacc_cardiff_ac_uk/IQB0hNKQDs55Tr260IsvIzaWASfPerftK6O6p-kquoCgemE?e=7yHkbL`
- `https://cf-my.sharepoint.com/:i:/g/personal/ohuabunwacc_cardiff_ac_uk/IQDeSQcJq6sdRKKakiSL4mPKAQBENorawqgonaaNlTTC9CQ?e=GPrSWb`
- `https://cf-my.sharepoint.com/:i:/g/personal/ohuabunwacc_cardiff_ac_uk/IQCnn4FUDO9wSaxrHhLJ99lkAedWTNOJfTO88YSQJjry42E?e=ZhtfW7`

Anti-references — what we are explicitly **not** trying to look like:

- `https://cf-my.sharepoint.com/:i:/g/personal/ohuabunwacc_cardiff_ac_uk/IQDU6Z-jKtHkRJR2ccbdy6XDAfxQq3M_jGMGSSsIuxvWTrg?e=4cPUo1`

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand_primary` | `#4B2A6B` | Header, "+" button, focus rings |
| `brand_accent` | `#4F7A5A` | Highlights, hover states, links |
| `surface_page` | `#F7F3EE` | Page background |
| `surface_card` | `#FFFDF9` | Card background |
| `text_primary` | `#1A1620` | Body text |
| `text_muted` | `#6B6474` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type_feature` | `#10B981` | Cards tagged `feature` (accent stripe + icon) |
| `type_bug` | `#DC2626` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due_safe` | `#7FA886` | More than 2 days out |
| `due_warning` | `#C08A2E` | Less than 24 hours |
| `due_overdue` | `#B23A3A` | Past due |
| `due_neutral` | `#9A94A3` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `Fraunces` | `Old style of serif that resembles an old regal book` |
| Body | `Inter` | `A calming sans-serif` |
| Monospace (tags, badges, code) | `JetBrains Mono` | `Clear and easy to read` |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and anchor board should both feel like they came from this doc.

- **Cards:** `Soft cream on ivory, almost weightless; a 1px warm border and a type-colored left stripe, no shadow except on hover.`
- **Buttons:** `Solid plum fill, no gradient, generous padding, rounded-md; sage on hover.`
- **Modal:** `Centered, max-width-md, cream surface, plum-black backdrop at 40% opacity.`
- **Empty states:** `Dashed lilac-grey border, muted text, calm and never sad.`
- **Drag affordance (if used):** `None — we use a status dropdown.`

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `New Task` |
| Empty column placeholder | `Nothing to see here!`|
| Toast after "Copy as Prompt Context" | `Copied and ready for AI` |
| Confirm-delete message | `Are you sure you want to delete?` |
| Handoff toast (M7 `task-owner`) | `Handed to {}, goodluck to them.` |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Cosy Coder's` (match PRD §11 team identity)
- **Wordmark style:** `Product name in heading font and brand primary color`

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
