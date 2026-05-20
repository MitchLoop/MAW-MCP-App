# Make-A-Wish MCP — clickable demo

Local Flask app that wraps three HTML mockup screens into a clickable presentation
prop for Make-A-Wish Foundation of America leadership.

> Synthetic data only. No PHI. No real LLM, no real MCP server.

## Run

Requires Python 3.10+.

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python app.py
```

Then open <http://127.0.0.1:5000>.

## Demo flow

1. **Screen 1 — Clinician sidebar.** Click **Draft referral ↗** on patient J.T. to advance.
2. **Screen 2 — Referral draft + advisor queue.** Click **Send to Dr. Patel ↗** on the
   left card to advance.
3. **Screen 3 — Physician sign-off.** Click **Sign and submit ↗** to show the
   submission confirmation; click **Restart demo** to return to Screen 1.

Every other button in the mockups fires a small toast: *"In production, this would
prompt Claude to ..."* — safe to click during Q&A.

## Presenter shortcuts

| Key | Action |
| --- | --- |
| `→` | Next screen |
| `←` | Previous screen |
| `R` | Restart from Screen 1 |
| `Esc` | Dismiss toast / success overlay |

The top nav (Screen 1 / 2 / 3 pills + refresh icon) is always available for jumping
around during Q&A.

## File layout

```
.
├── app.py                        # Flask routes: /, /screen/<n>
├── requirements.txt
├── README.md
├── make_a_wish_mcp_clinician_sidebar_mockup.html              # Screen 1 fragment
├── make_a_wish_mcp_referral_draft_and_advisor_queue_mockup.html # Screen 2 fragment
├── make_a_wish_mcp_physician_signoff_mockup.html              # Screen 3 fragment
├── templates/
│   └── base.html                 # Host shell wrapping each fragment
└── static/
    ├── host.css                  # CSS vars (light Claude.ai-ish palette), resets, nav, toast, overlay
    └── host.js                   # sendPrompt() shim, arrow/R/Esc keys, navigation
```

The HTML fragments are read from disk on each request, so you can tweak copy in any
fragment and refresh the browser without restarting Flask.

## Theming notes

CSS variables consumed by the fragments are defined on `:root` in
`static/host.css` — adjust there if you want a different palette. Tabler Icons are
pulled from a jsDelivr CDN (`@tabler/icons-webfont@3.5.0`); if you're presenting
without internet, run `pip download` and a Tabler Icons mirror in advance, or save
the CSS + font files into `static/` and update the `<link>` in `templates/base.html`.

## Things to test before the presentation

- All three screens render with icons visible (Tabler font loaded).
- Click-through path: Screen 1 *Draft referral* (J.T.) → Screen 2 *Send to Dr. Patel*
  → Screen 3 *Sign and submit* → success overlay → *Restart demo* → Screen 1.
- Arrow keys advance and back-step screens. `R` restarts. `Esc` dismisses overlays.
- Top-nav pills jump directly to any screen.
- Non-transition buttons (e.g. *Why eligible*, *Approve*, *Hold*) fire the toast
  and do not navigate away.
- The footer shows "Screen X of 3" and the no-PHI disclaimer on every screen.
- Test offline: disable Wi-Fi after first load to confirm the demo still functions
  (icons may show as blank squares if Tabler hasn't been cached — see above).
