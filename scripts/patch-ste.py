#!/usr/bin/env python3
"""Apply live-site customizations to a Design Canvas STE export.

Accepts a Claude Design Canvas page or a Bundled Page HTML file.
Keeps module TRY AGAIN. Final quiz stays one-shot. Developer mode is
hidden: five clicks on the home eyebrow, then the developer password.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

DEV_HASH = "8026cc3c4a8501cfef09f31df5dcea55b33d1424bbd9fc985857f85d045d9fc9"

OVERLAY = r'''
<sc-if value="{{ timerAsk }}" hint-placeholder-val="{{ false }}">
<div style="position:fixed;inset:0;background:rgba(61,54,44,0.4);display:flex;align-items:center;justify-content:center;z-index:80;padding:20px;">
<div style="width:min(22rem,100%);background:#fffdf8;border:2px solid #ece2d2;border-radius:20px;padding:18px 18px 16px;box-shadow:0 8px 0 #ece2d2;">
<div style="font-size:17px;font-weight:900;color:#3d362c;margin-bottom:6px;">Developer mode</div>
<div style="font-size:14px;font-weight:600;color:#8a7f6f;line-height:1.5;margin-bottom:12px;">Enter the developer password to skip wait timers and unlock every module.</div>
<input id="timer-pw" type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;border:2px solid #ece2d2;border-radius:12px;padding:11px 12px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;color:#3d362c;" />
<sc-if value="{{ timerErr }}" hint-placeholder-val="{{ false }}"><div style="margin-top:8px;font-size:13px;font-weight:800;color:oklch(0.45 0.14 25);">Not correct.</div></sc-if>
<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;">
<div onClick="{{ cancelSkip }}" style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;letter-spacing:0.8px;padding:10px 16px;border-radius:12px;cursor:pointer;user-select:none;background:#fffdf8;color:#8a7f6f;border:2px solid #ece2d2;box-shadow:0 3px 0 #ece2d2;">CANCEL</div>
<div onClick="{{ confirmSkip }}" style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;letter-spacing:0.8px;padding:10px 16px;border-radius:12px;cursor:pointer;user-select:none;background:oklch(0.62 0.15 40);color:#fff;box-shadow:0 3px 0 oklch(0.50 0.15 40);">TURN ON</div>
</div>
</div>
</div>
</sc-if>
'''

DEV_METHODS = """  skip() { return !!this.state.skipTimers; }
  tapDev() {
    const now = Date.now();
    if (!this._devTaps || now - this._devAt > 1800) this._devTaps = 0;
    this._devAt = now;
    this._devTaps += 1;
    if (this._devTaps < 5) return;
    this._devTaps = 0;
    this.askSkip();
  }
  askSkip() {
    if (this.skip()) {
      try {
        localStorage.setItem('brv-dev-mode', '0');
        localStorage.setItem('brv-skip-timers', '0');
      } catch (e) {}
      this.set({ skipTimers: false });
      return;
    }
    this.set({ timerAsk: true, timerErr: false });
    setTimeout(() => {
      const el = document.getElementById('timer-pw');
      if (!el) return;
      el.focus();
      el.onkeydown = (e) => { if (e.key === 'Enter') this.confirmSkip(); };
    }, 0);
  }
  cancelSkip() { this.set({ timerAsk: false, timerErr: false }); }
  confirmSkip() {
    const el = document.getElementById('timer-pw');
    const pw = el ? el.value : '';
    const run = async () => {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
      const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      const ok = hex === '%s';
      if (!ok) { this.set({ timerErr: true }); return; }
      try {
        localStorage.setItem('brv-dev-mode', '1');
        localStorage.setItem('brv-skip-timers', '1');
      } catch (e) {}
      this.set({ skipTimers: true, timerAsk: false, timerErr: false, lockUntil: 0, flowLockUntil: 0 });
    };
    run();
  }
""" % DEV_HASH

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">'
    '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&amp;display=swap" rel="stylesheet">\n'
)


def must_replace(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"missing block: {label}")
    return text.replace(old, new, 1)


def load_source(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if '<script type="__bundler/template">' in text:
        match = re.search(r'<script type="__bundler/template">(.*?)</script>', text, re.S)
        if not match:
            raise SystemExit("bundled page has no template")
        text = json.loads(match.group(1).strip())
    return text


def normalize(text: str) -> str:
    text = re.sub(
        r'<script src="[0-9a-f-]{36}"></script>',
        '<script src="./support.js"></script>',
        text,
        count=1,
    )
    text = text.replace("sc-camel-on-click=", "onClick=")
    text = re.sub(
        r'<link rel="preconnect" href="https://fonts\.googleapis\.com">.*?</style>\s*(<style>)',
        FONTS + r"\1",
        text,
        count=1,
        flags=re.S,
    )
    if "./support.js" not in text:
        raise SystemExit("normalize: support.js script missing")
    if "fonts.googleapis.com/css2?family=Nunito" not in text:
        raise SystemExit("normalize: Nunito stylesheet missing")
    if "sc-camel-on-click=" in text:
        raise SystemExit("normalize: leftover sc-camel-on-click")
    return text


def patch(text: str, with_gate: bool) -> str:
    text = normalize(text)

    if with_gate:
        text = must_replace(
            text,
            '<script src="./support.js"></script>',
            '<script src="../shared/gate.js"></script>\n<script src="./support.js"></script>',
            "gate script",
        )

    text = must_replace(
        text,
        '<div style="font-size:12px;font-weight:800;letter-spacing:2px;color:oklch(0.55 0.15 40);">A COURSE FOR NEW TASKERS</div>',
        '<div onClick="{{ tapDev }}" style="font-size:12px;font-weight:800;letter-spacing:2px;color:oklch(0.55 0.15 40);">A COURSE FOR NEW TASKERS</div>',
        "hidden eyebrow tap",
    )

    text = must_replace(
        text,
        '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device. <span onClick="{{ restart }}" style="text-decoration:underline;cursor:pointer;">Reset</span></div>',
        '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device.<sc-if value="{{ showHomeReset }}" hint-placeholder-val="{{ false }}"> <span onClick="{{ restart }}" style="text-decoration:underline;cursor:pointer;">Reset</span></sc-if></div>',
        "home reset",
    )

    text = text.replace(
        '<div style="text-align:center;margin-top:16px;"><a href="faq/" style="display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:99px;background:#fffdf8;border:2px solid #ece2d2;box-shadow:0 3px 0 #ece2d2;color:oklch(0.55 0.15 40);font-size:12px;font-weight:900;letter-spacing:0.8px;text-decoration:none;">PROJECT FAQ</a></div>\n',
        "",
    )
    if "Already in the project and need admin help?" not in text:
        text = must_replace(
            text,
            '<div style="max-width:600px;margin:0 auto;padding:44px 24px 64px;display:flex;flex-direction:column;gap:14px;">\n<div style="text-align:center;margin-bottom:14px;">',
            '<div style="max-width:600px;margin:0 auto;padding:44px 24px 64px;display:flex;flex-direction:column;gap:14px;">\n'
            '<a href="faq/" style="display:block;text-decoration:none;color:inherit;background:oklch(0.95 0.04 230);border:2px solid oklch(0.78 0.08 230);border-radius:20px;padding:16px 18px;box-shadow:0 4px 0 oklch(0.78 0.08 230);">\n'
            '<div style="font-size:20px;font-weight:900;color:#3d362c;margin-bottom:6px;line-height:1.25;">Already in the project and need admin help?</div>\n'
            '<div style="font-size:14.5px;font-weight:600;color:#5c5346;line-height:1.5;margin-bottom:12px;">FAQs for payment, Hubstaff, login, and other admin issues.</div>\n'
            '<div style="display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:13px;background:oklch(0.52 0.12 230);color:#fff;font-size:12px;font-weight:900;letter-spacing:0.8px;">EXPLORE THE FAQ</div>\n'
            '</a>\n'
            '<div style="text-align:center;margin-bottom:14px;">',
            "faq card top",
        )
        text = must_replace(
            text,
            '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device.',
            '<a href="faq/" style="display:block;text-decoration:none;color:inherit;background:oklch(0.95 0.04 230);border:2px solid oklch(0.78 0.08 230);border-radius:20px;padding:16px 18px;box-shadow:0 4px 0 oklch(0.78 0.08 230);">\n'
            '<div style="font-size:18px;font-weight:900;color:#3d362c;margin-bottom:4px;">Already in the project and need admin help?</div>\n'
            '<div style="font-size:14px;font-weight:600;color:#5c5346;line-height:1.5;">FAQs for payment, Hubstaff, login, and other admin issues.</div>\n'
            '</a>\n\n'
            '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device.',
            "faq card bottom",
        )

    text = must_replace(text, "</div>\n</x-dc>", OVERLAY + "\n</div>\n</x-dc>", "overlay")

    text = must_replace(
        text,
        "  state = { view: 'home', i: 0, done: {}, ans: {}, sel: {}, perm: {}, tries: {}, elim: {}, lockUntil: 0, readDone: {}, flowSeen: {}, flowSel: '', stepSeen: {}, stepSel: '', sortAns: {}, walkSeen: {}, accAns: {}, ladSeen: {}, chunk: {}, fq: { ans: {}, sub: false } };",
        "  state = { view: 'home', i: 0, done: {}, ans: {}, sel: {}, perm: {}, tries: {}, elim: {}, lockUntil: 0, readDone: {}, flowSeen: {}, flowSel: '', stepSeen: {}, stepSel: '', sortAns: {}, walkSeen: {}, accAns: {}, ladSeen: {}, chunk: {}, fq: { ans: {}, sub: false }, skipTimers: false, timerAsk: false, timerErr: false };",
        "state",
    )

    text = must_replace(
        text,
        "    } catch (e) {}\n    const perm = {};",
        "    } catch (e) {}\n    try {\n      if (localStorage.getItem('brv-dev-mode') === '1' || localStorage.getItem('brv-skip-timers') === '1') this.setState({ skipTimers: true });\n    } catch (e) {}\n    const perm = {};",
        "load dev mode",
    )

    text = must_replace(
        text,
        "  set(p) { this.setState(p, () => this.save()); }\n  strict() { return this.props.strictMode ?? true; }",
        "  set(p) { this.setState(p, () => this.save()); }\n" + DEV_METHODS + "  strict() { return this.props.strictMode ?? true; }",
        "dev methods",
    )

    text = text.replace("this.props.skipTimers ?? false", "this.skip()")

    text = must_replace(
        text,
        "  modUnlocked(m) {\n    if (!(this.props.lockModules ?? true)) return true;",
        "  modUnlocked(m) {\n    if (this.skip()) return true;\n    if (!(this.props.lockModules ?? true)) return true;",
        "modUnlocked",
    )

    text = must_replace(
        text,
        "v.showReset = (this.props.showPageReset ?? false) && view === 'lesson';",
        "v.showReset = this.skip() && view === 'lesson';",
        "showReset",
    )

    bindings = """    v.showHomeReset = this.skip();
    v.timerAsk = !!this.state.timerAsk;
    v.timerErr = !!this.state.timerErr;
    v.tapDev = () => this.tapDev();
    v.askSkip = () => this.askSkip();
    v.cancelSkip = () => this.cancelSkip();
    v.confirmSkip = () => this.confirmSkip();
"""
    text = must_replace(
        text,
        "    v.showReset = this.skip() && view === 'lesson';\n    v.restart = () => this.restart();",
        "    v.showReset = this.skip() && view === 'lesson';\n    v.restart = () => this.restart();\n" + bindings,
        "bindings",
    )

    if "The flagged issue." not in text:
        raise SystemExit("missing flagged-issue glossary line")
    if "The pre-written complaint on the transcript." in text:
        raise SystemExit("old glossary line still present")
    if text.count("TRY AGAIN") < 8:
        raise SystemExit(f"module TRY AGAIN missing ({text.count('TRY AGAIN')})")
    if "DEVELOPER MODE" in text:
        raise SystemExit("visible developer mode chip leaked into markup")
    if "tapDev" not in text:
        raise SystemExit("hidden eyebrow tap missing")
    if "showHomeReset" not in text:
        raise SystemExit("gated home reset missing")
    if "if (fq.sub) return;" not in text:
        raise SystemExit("final quiz lock missing")
    if with_gate and "../shared/gate.js" not in text:
        raise SystemExit("gate missing")
    if "Already in the project and need admin help?" not in text or 'href="faq/"' not in text:
        raise SystemExit("faq help card missing")
    return text


def main() -> None:
    src = load_source(Path(sys.argv[1]))
    dest = Path(sys.argv[2])
    with_gate = sys.argv[3] == "gate"
    dest.write_text(patch(src, with_gate))
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
