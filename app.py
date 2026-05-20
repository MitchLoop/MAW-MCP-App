"""Make-A-Wish MCP demo — Flask host for three HTML mockup screens."""
from pathlib import Path
from flask import Flask, abort, render_template

ROOT = Path(__file__).parent

PERSONAS = {
    "maria": {
        "key": "maria",
        "name": "Maria Santos",
        "role": "Pediatric oncology · MSW",
        "initials": "MS",
        "avatar_bg": "#FBEAF0",
        "avatar_fg": "#72243E",
        "workspace": "Anchor Children's Hospital",
        "recents": [
            {"title": "Screen Peds Onc 7-West for Make-A-Wish", "meta": "Just now", "active": True},
            {"title": "Discharge planning · K. Alvarez", "meta": "Yesterday"},
            {"title": "Family resource navigator follow-ups", "meta": "Yesterday"},
            {"title": "PFAC agenda · May meeting", "meta": "Mon"},
            {"title": "Sibling support group intake", "meta": "Last week"},
            {"title": "Bereavement check-ins · April", "meta": "Apr 28"},
        ],
        "projects": [
            {"name": "Make-A-Wish screening", "icon": "ti-heart-handshake", "active": True},
            {"name": "Inpatient psychosocial rounds", "icon": "ti-clipboard-heart"},
            {"name": "Community referrals", "icon": "ti-map-pin"},
        ],
    },
    "patel": {
        "key": "patel",
        "name": "Dr. R. Patel",
        "role": "Pediatric Heme/Onc · Attending",
        "initials": "RP",
        "avatar_bg": "#E1F5EE",
        "avatar_fg": "#04342C",
        "workspace": "Anchor Children's Hospital",
        "recents": [
            {"title": "Sign-offs awaiting review", "meta": "Just now", "active": True},
            {"title": "Morning rounds · 7-West", "meta": "Today"},
            {"title": "AML induction protocol notes", "meta": "Today"},
            {"title": "Tumor board prep · Thursday", "meta": "Yesterday"},
            {"title": "Fellow teaching · neutropenic fever", "meta": "Mon"},
            {"title": "Clinic schedule · next week", "meta": "Last week"},
        ],
        "projects": [
            {"name": "Make-A-Wish sign-offs", "icon": "ti-signature", "active": True},
            {"name": "Heme/Onc service line", "icon": "ti-stethoscope"},
            {"name": "Research · AML cohort", "icon": "ti-microscope"},
        ],
    },
}

SCREENS = [
    {
        "num": 1,
        "title": "Clinician sidebar",
        "subtitle": "Maria Santos · Pediatric oncology MSW",
        "file": "make_a_wish_mcp_clinician_sidebar_mockup.html",
        "persona": "maria",
        "chat_title": "Screen Peds Onc 7-West for Make-A-Wish",
    },
    {
        "num": 2,
        "title": "Referral draft + advisor queue",
        "subtitle": "Review before sending for medical sign-off",
        "file": "make_a_wish_mcp_referral_draft_and_advisor_queue_mockup.html",
        "persona": "maria",
        "chat_title": "Referral draft · J.T. · advisor queue",
    },
    {
        "num": 3,
        "title": "Physician sign-off",
        "subtitle": "Dr. R. Patel · Pediatric Heme/Onc inbox",
        "file": "make_a_wish_mcp_physician_signoff_mockup.html",
        "persona": "patel",
        "chat_title": "Make-A-Wish sign-off · J.T.",
    },
]


def load_fragment(filename: str) -> str:
    path = ROOT / filename
    if not path.exists():
        return f'<div style="padding:24px;color:#a00">Missing fragment: {filename}</div>'
    return path.read_text(encoding="utf-8")


app = Flask(__name__, template_folder="templates", static_folder="static")


@app.route("/")
@app.route("/screen/<int:num>")
def screen(num: int = 1):
    if num < 1 or num > len(SCREENS):
        abort(404)
    current = SCREENS[num - 1]
    persona = PERSONAS[current["persona"]]
    return render_template(
        "base.html",
        screens=SCREENS,
        current=current,
        persona=persona,
        fragment=load_fragment(current["file"]),
        total=len(SCREENS),
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
