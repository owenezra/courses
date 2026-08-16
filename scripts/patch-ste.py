#!/usr/bin/env python3
"""Apply live-site customizations to a Design Canvas STE export."""
from __future__ import annotations

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


def must_replace(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"missing block: {label}")
    return text.replace(old, new, 1)


def patch(text: str, with_gate: bool) -> str:
    if with_gate:
        text = must_replace(
            text,
            '<script src="./support.js"></script>',
            '<script src="../shared/gate.js"></script>\n<script src="./support.js"></script>',
            "gate script",
        )

    text = must_replace(
        text,
        '<div style="max-width:600px;margin:0 auto;padding:44px 24px 64px;display:flex;flex-direction:column;gap:14px;">\n<div style="text-align:center;margin-bottom:14px;">',
        '<div style="max-width:600px;margin:0 auto;padding:28px 24px 64px;display:flex;flex-direction:column;gap:14px;">\n<div style="display:flex;justify-content:flex-start;"><div onClick="{{ askSkip }}" style="{{ timerChip }}">{{ timerLbl }}</div></div>\n<div style="text-align:center;margin-bottom:14px;">',
        "home top button",
    )

    text = must_replace(
        text,
        '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device. <span onClick="{{ restart }}" style="text-decoration:underline;cursor:pointer;">Reset</span></div>',
        '<div style="text-align:center;margin-top:18px;font-size:12.5px;font-weight:700;color:#b0a48d;">Progress is stored on this device.</div>',
        "home reset",
    )

    text = re.sub(
        r'(<div style="font-size:13px;font-weight:800;color:oklch\(0\.45 0\.14 25\);">✕ Not correct\.</div>)<div onClick="\{\{ soR\d \}\}" style="\{\{ soRs\d \}\}">TRY AGAIN</div>',
        r"\1",
        text,
    )
    text = re.sub(
        r'(<div style="font-size:13px;font-weight:800;color:oklch\(0\.45 0\.14 25\);">✕ Not correct\.</div>)<div onClick="\{\{ acR\d \}\}" style="\{\{ acRs\d \}\}">TRY AGAIN</div>',
        r"\1",
        text,
    )
    text = re.sub(
        r'(<div style="font-size:13\.5px;font-weight:800;color:oklch\(0\.45 0\.14 25\);">✕ Not correct\.</div>)<div onClick="\{\{ [a-z0-9]+rty \}\}" style="\{\{ [a-z0-9]+rbs \}\}">\{\{ [a-z0-9]+rbl \}\}</div>',
        r"\1",
        text,
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
        "    if (i === 7 && !(this.SORT.every((x, k) => this.state.sortAns[k] === x.b) && this.WALK.every(n => this.state.walkSeen[n]))) return false;\n    if (i === 8 && !this.ACC.every((x, k) => this.state.accAns[k] === x.c)) return false;",
        "    if (i === 7 && !(this.SORT.every((x, k) => this.state.sortAns[k] != null) && this.WALK.every(n => this.state.walkSeen[n]))) return false;\n    if (i === 8 && !this.ACC.every((x, k) => this.state.accAns[k] != null)) return false;",
        "answered sort/acc",
    )
    text = must_replace(
        text,
        "    return this.quizzesOf(i).every(q => { const a = this.state.ans[q]; return a != null && (!st || this.isOk(q, a)); });",
        "    return this.quizzesOf(i).every(q => this.state.ans[q] != null);",
        "answered quizzes",
    )

    text = must_replace(
        text,
        """  accRetry(k) {
    const na = { ...this.state.accAns }; delete na[k];
    this.set({ accAns: na });
  }""",
        "  accRetry(k) { return; }",
        "accRetry",
    )
    text = must_replace(
        text,
        """  sortRetry(k) {
    const na = { ...this.state.sortAns }; delete na[k];
    this.set({ sortAns: na });
  }""",
        "  sortRetry(k) { return; }",
        "sortRetry",
    )
    text = must_replace(
        text,
        """  retryMini(q) {
    if (this.locked()) return;
    const na = { ...this.state.ans }; delete na[q];
    this.set({ ans: na });
  }""",
        "  retryMini(q) { return; }",
        "retryMini",
    )
    text = must_replace(
        text,
        "  modUnlocked(m) {\n    if (!(this.props.lockModules ?? true)) return true;",
        "  modUnlocked(m) {\n    if (this.skip()) return true;\n    if (!(this.props.lockModules ?? true)) return true;",
        "modUnlocked",
    )

    text = must_replace(
        text,
        """      this.setState(upd, () => { this.save(); if (wrong && this.strict()) this.startLock(this.lockMs(nt)); });""",
        """      this.setState(upd, () => { this.save(); });""",
        "mini lock",
    )
    text = must_replace(
        text,
        """        this.setState(upd, () => {
          this.save();
          if (wrong && this.strict()) this.startLock(this.lockMs(nt));
          const el = this.mr && this.mr.current;
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        });""",
        """        this.setState(upd, () => {
          this.save();
          const el = this.mr && this.mr.current;
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        });""",
        "check lock",
    )
    text = must_replace(
        text,
        """      if (this.strict() && a !== this.QZ[q].c) {
        if (this.locked()) return;
        const na = { ...ans }; delete na[q];
        const ns = { ...sel }; delete ns[q];
        this.set({ ans: na, sel: ns });
        return;
      }""",
        """      if (this.strict() && a !== this.QZ[q].c) {
        this.advance();
        return;
      }""",
        "primary retry",
    )

    text = must_replace(
        text,
        """  restart() {
    if (!window.confirm('Reset all course progress?')) return;
    this.set({ view: 'home', i: 0, done: {}, ans: {}, sel: {}, tries: {}, elim: {}, lockUntil: 0, readDone: {}, flowSeen: {}, flowSel: '', stepSeen: {}, sortAns: {}, walkSeen: {}, accAns: {}, ladSeen: {}, chunk: {}, fq: { ans: {}, sub: false } });
  }""",
        "  restart() { return; }",
        "restart",
    )

    text = must_replace(
        text,
        "v[q + 'ex'] = ans[q] != null && (ans[q] === cfg.c || !st);",
        "v[q + 'ex'] = ans[q] != null;",
        "show expl",
    )
    text = must_replace(
        text,
        "v[q + 'rbl'] = lk2 ? 'WAIT ' + s2 : 'TRY AGAIN';",
        "v[q + 'rbl'] = '';",
        "rbl",
    )

    text = must_replace(
        text,
        """      v.fbSub = ok ? '' : (st ? 'Read the hint. Then try again.' : 'The correct answer is ' + name + '.');
      const lk = st && !ok && this.locked();
      const secs = lk ? Math.ceil((this.state.lockUntil - Date.now()) / 1000) : 0;
      const minisLeft = this.quizzesOf(i).filter(x => this.QZ[x].mini).some(x => ans[x] == null || (st && !this.isOk(x, ans[x])));
      v.fbBtn = (st && !ok) ? (lk ? 'WAIT ' + secs : 'TRY AGAIN') : (minisLeft ? 'DO "ONE MORE" BELOW' : 'CONTINUE');
      const mutedBtn = { ...this.btn(25, true), background: '#e9dfcd', color: '#b0a48d', boxShadow: '0 4px 0 #d8cdb8', cursor: 'default' };
      v.fbBtnSty = lk ? mutedBtn : ((ok || !st) && minisLeft ? mutedBtn : this.btn(ok ? 150 : 25, true));""",
        """      v.fbSub = ok ? '' : 'The correct answer is ' + name + '.';
      const lk = false;
      const secs = 0;
      const minisLeft = this.quizzesOf(i).filter(x => this.QZ[x].mini).some(x => ans[x] == null);
      v.fbBtn = minisLeft ? 'DO "ONE MORE" BELOW' : 'CONTINUE';
      const mutedBtn = { ...this.btn(25, true), background: '#e9dfcd', color: '#b0a48d', boxShadow: '0 4px 0 #d8cdb8', cursor: 'default' };
      v.fbBtnSty = minisLeft ? mutedBtn : this.btn(ok ? 150 : 25, true);""",
        "feedback",
    )

    text = must_replace(
        text,
        "const minisOk = this.quizzesOf(i).filter(x => this.QZ[x].mini).every(x => ans[x] != null && (!st || this.isOk(x, ans[x])));",
        "const minisOk = this.quizzesOf(i).filter(x => this.QZ[x].mini).every(x => ans[x] != null);",
        "minisOk",
    )
    text = must_replace(
        text,
        "const sortDone = this.SORT.every((x, k) => this.state.sortAns[k] === x.b);",
        "const sortDone = this.SORT.every((x, k) => this.state.sortAns[k] != null);",
        "sortDone",
    )
    text = must_replace(
        text,
        "const accDone = this.ACC.every((x, k) => this.state.accAns[k] === x.c);",
        "const accDone = this.ACC.every((x, k) => this.state.accAns[k] != null);",
        "accDone",
    )
    text = must_replace(
        text,
        "v.showReset = (this.props.showPageReset ?? false) && view === 'lesson';",
        "v.showReset = this.skip() && view === 'lesson';",
        "showReset",
    )

    bindings = """    v.timerAsk = !!this.state.timerAsk;
    v.timerErr = !!this.state.timerErr;
    v.askSkip = () => this.askSkip();
    v.cancelSkip = () => this.cancelSkip();
    v.confirmSkip = () => this.confirmSkip();
    v.timerChip = this.skip()
      ? { fontFamily: "'Nunito',sans-serif", fontSize: '11px', fontWeight: 900, letterSpacing: '0.8px', height: '38px', padding: '0 12px', borderRadius: '99px', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexShrink: 0, background: 'oklch(0.95 0.05 150)', color: 'oklch(0.38 0.1 150)', whiteSpace: 'nowrap' }
      : { fontFamily: "'Nunito',sans-serif", fontSize: '11px', fontWeight: 900, letterSpacing: '0.8px', height: '38px', padding: '0 12px', borderRadius: '99px', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexShrink: 0, background: '#f0e8da', color: '#8a7f6f', whiteSpace: 'nowrap' };
    v.timerLbl = this.skip() ? 'DEVELOPER MODE · ON' : 'DEVELOPER MODE';
"""
    text = must_replace(
        text,
        "    v.showReset = this.skip() && view === 'lesson';\n    v.restart = () => this.restart();",
        "    v.showReset = this.skip() && view === 'lesson';\n    v.restart = () => this.restart();\n" + bindings,
        "bindings",
    )

    leftover = text.count("TRY AGAIN")
    if leftover:
        raise SystemExit(f"still {leftover} TRY AGAIN strings")
    if "DEVELOPER MODE" not in text:
        raise SystemExit("developer button missing")
    if with_gate and "../shared/gate.js" not in text:
        raise SystemExit("gate missing")
    return text


def main() -> None:
    src = Path(sys.argv[1]).read_text()
    dest = Path(sys.argv[2])
    with_gate = sys.argv[3] == "gate"
    dest.write_text(patch(src, with_gate))
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
