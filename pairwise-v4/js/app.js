(() => {
  const KEY = "pairwise-v4-primer";

  const state = load() || {
    i: 0,
    farthest: 0,
    answers: {},
    seen: {},
    score: { correct: 0, tried: 0 },
    startedAt: Date.now(),
  };

  const root = document.getElementById("app");
  const screens = COURSE.screens;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function screen() {
    return screens[state.i];
  }

  function setAnswer(part, value, silent) {
    const id = screen().id;
    state.answers[id] = state.answers[id] || {};
    state.answers[id][part] = value;
    save();
    if (!silent) render();
  }

  function getAnswer(part) {
    return (state.answers[screen().id] || {})[part];
  }

  function mark(ok, part) {
    const id = screen().id;
    const key = id + ":" + (part || getAnswer("q") || "main");
    if (!state.seen[key]) {
      state.seen[key] = ok ? "ok" : "bad";
      state.score.tried += 1;
      if (ok) state.score.correct += 1;
    }
    save();
    render();
  }

  function go(delta) {
    const next = state.i + delta;
    if (next < 0 || next >= screens.length) return;
    if (delta > 0 && !complete(screen())) return;
    state.i = next;
    state.farthest = Math.max(state.farthest || 0, state.i);
    save();
    render();
    window.scrollTo(0, 0);
  }

  function jump(index) {
    if (index > (state.farthest || 0)) return;
    state.i = index;
    save();
    render();
    window.scrollTo(0, 0);
  }

  function complete(s) {
    const a = state.answers[s.id] || {};
    switch (s.type) {
      case "teach":
      case "done":
        return true;
      case "cards":
        return s.items.every((_, i) => a["c" + i] !== undefined);
      case "choice":
        return Boolean(a.choice);
      case "sort":
        return Boolean(a.checked) && s.items.every((item) => a[item.id]);
      case "match":
        return Object.keys(a.pairs || {}).length === s.pairs.length;
      case "checklist":
        return s.items.every((_, i) => a["k" + i]);
      case "steps":
        return s.steps.every((_, i) => a["st" + i]);
      case "desk":
        return s.questions.every((q) => a[q.id]);
      case "axes":
        return Boolean(a.checked);
      case "severity":
        return a.sev != null;
      case "compare":
        return a.score != null;
      case "fail":
        return Boolean(a.checked);
      default:
        return false;
    }
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paras(lines) {
    return (lines || []).map((line) => `<p>${esc(line)}</p>`).join("");
  }

  function stationIndex(id) {
    return COURSE.stations.findIndex((s) => s.id === id);
  }

  function render() {
    const s = screen();
    const reached = state.farthest || 0;
    const pct = Math.round((state.i / (screens.length - 1)) * 100);
    const currentStation = stationIndex(s.station);

    root.innerHTML = `
      <div class="app">
        <header class="top">
          <div class="top-inner">
            <div class="brand">
              <a class="home" href="../">All courses</a>
              <strong>${esc(COURSE.title)}</strong>
              <span>${esc(COURSE.blurb)}</span>
            </div>
            <div class="meta">
              <span class="pill">${esc(COURSE.minutes)}</span>
              <span class="pill">Score <b>${state.score.correct}</b> / ${state.score.tried || 0}</span>
              <span class="pill">Station <b>${currentStation + 1}</b> / ${COURSE.stations.length}</span>
            </div>
          </div>
          <div class="top-inner" style="padding-top:0">
            <nav class="rail" aria-label="Stations">
              ${COURSE.stations
                .map((st, i) => {
                  const first = screens.findIndex((x) => x.station === st.id);
                  const here = st.id === s.station;
                  const done = i < currentStation || (here && complete(s));
                  const open = first <= reached;
                  return `<button type="button" class="${here ? "here" : ""} ${done ? "done" : ""}" data-jump="${first}" ${open ? "" : "disabled"}>${esc(st.label)}</button>`;
                })
                .join("")}
            </nav>
          </div>
          <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>
        </header>
        <main class="stage" id="stage">${body(s)}</main>
        <div class="bar">
          <button class="btn ghost" type="button" data-go="-1" ${state.i === 0 ? "disabled" : ""}>Back</button>
          <button class="btn" type="button" data-go="1" ${state.i === screens.length - 1 || !complete(s) ? "disabled" : ""}>
            ${state.i === screens.length - 2 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    `;

    bind(s);
    if (s.type === "sort") {
      bindDrag(s, "[data-hold]", "[data-bin]", (id, bin) => placeSort(id, bin));
    }
    if (s.type === "match") {
      bindDrag(s, "[data-word]", "[data-meaning]", (wordId, meaningId) => {
        if (wordId !== meaningId) {
          setAnswer("held", null, true);
          mark(false, "miss-" + wordId + "-" + meaningId);
          return;
        }
        const pairs = { ...(getAnswer("pairs") || {}) };
        pairs[wordId] = meaningId;
        setAnswer("pairs", pairs, true);
        setAnswer("held", null, true);
        mark(true, "pair-" + wordId);
      });
      bindDrag(s, "[data-unpair]", "[data-pool]", (wordId) => {
        const pairs = { ...(getAnswer("pairs") || {}) };
        delete pairs[wordId];
        setAnswer("pairs", pairs, true);
        setAnswer("held", null);
      });
    }
  }

  function placeSort(id, bin) {
    state.flashId = id;
    if (bin === "pool") {
      const ans = state.answers[screen().id] || {};
      delete ans[id];
      state.answers[screen().id] = ans;
      setAnswer("held", null, true);
      save();
      render();
    } else {
      setAnswer(id, bin, true);
      setAnswer("held", null, true);
      render();
    }
    window.setTimeout(() => {
      if (state.flashId === id) state.flashId = null;
    }, 400);
  }

  function bindDrag(_s, handleSel, dropSel, onDrop) {
    root.querySelectorAll(handleSel).forEach((el) => {
      el.addEventListener("pointerdown", (ev) => {
        if (ev.button != null && ev.button !== 0) return;
        const id = el.dataset.hold || el.dataset.word || el.dataset.unpair;
        if (!id) return;
        const startX = ev.clientX;
        const startY = ev.clientY;
        let dragging = false;
        let ghost = null;

        const move = (e) => {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (!dragging && Math.hypot(dx, dy) < 7) return;
          if (!dragging) {
            dragging = true;
            el.classList.add("ghosting");
            ghost = el.cloneNode(true);
            ghost.classList.add("drag-ghost");
            ghost.style.width = el.getBoundingClientRect().width + "px";
            document.body.appendChild(ghost);
            try {
              el.setPointerCapture(e.pointerId);
            } catch {
              /* ignore */
            }
          }
          ghost.style.left = e.clientX + "px";
          ghost.style.top = e.clientY + "px";
          const under = document.elementFromPoint(e.clientX, e.clientY);
          root.querySelectorAll(dropSel).forEach((bin) => {
            bin.classList.toggle("hot", Boolean(under && (bin === under || bin.contains(under))));
          });
        };

        const up = (e) => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          if (!dragging) return;
          e.preventDefault();
          el.addEventListener(
            "click",
            (clickEv) => {
              clickEv.preventDefault();
              clickEv.stopPropagation();
            },
            { once: true, capture: true }
          );
          const under = document.elementFromPoint(e.clientX, e.clientY);
          const drop = under && under.closest(dropSel);
          if (ghost) ghost.remove();
          el.classList.remove("ghosting");
          root.querySelectorAll(dropSel).forEach((bin) => bin.classList.remove("hot"));
          if (drop) {
            const dropId = drop.dataset.bin || drop.dataset.meaning;
            onDrop(id, dropId);
          }
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      });
    });
  }

  function body(s) {
    const head = `
      <p class="kicker">${esc(s.kicker || "")}</p>
      <h1>${esc(s.title)}</h1>
      ${s.lead ? `<div class="lead">${paras(s.lead)}</div>` : ""}
    `;
    switch (s.type) {
      case "teach":
        return head + teach(s);
      case "cards":
        return head + cards(s);
      case "choice":
        return head + choice(s);
      case "sort":
        return head + sort(s);
      case "match":
        return head + match(s);
      case "checklist":
        return head + checklist(s);
      case "steps":
        return head + steps(s);
      case "desk":
        return head + desk(s);
      case "axes":
        return head + axes(s);
      case "severity":
        return head + severity(s);
      case "compare":
        return head + compare(s);
      case "fail":
        return head + fail(s);
      case "done":
        return done(s);
      default:
        return head;
    }
  }

  function teach(s) {
    return `
      <div class="stack">
        <div class="prose">${paras(s.body)}</div>
        ${
          s.notes
            ? `<div class="card notes"><ul>${s.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`
            : ""
        }
      </div>
    `;
  }

  function cards(s) {
    const a = state.answers[s.id] || {};
    return `
      ${s.prompt ? `<p class="note">${esc(s.prompt)}</p>` : ""}
      <div class="stack">
        ${s.items
          .map((item, i) => {
            const pick = a["c" + i];
            const shown = pick !== undefined;
            const ok = pick === item.answer;
            return `
              <article class="card">
                <p>${esc(item.text)}</p>
                <div class="row">
                  <button class="choice ${pick === true ? (ok ? "right" : "wrong") : ""}" data-card="${i}" data-val="yes" ${shown ? "disabled" : ""}>${esc(item.yes)}</button>
                  <button class="choice ${pick === false ? (ok ? "right" : "wrong") : ""}" data-card="${i}" data-val="no" ${shown ? "disabled" : ""}>${esc(item.no)}</button>
                </div>
                ${
                  shown
                    ? `<div class="feedback ${ok ? "ok" : "bad"}" style="margin-top:0.75rem"><p><strong>${ok ? "Correct." : "Not correct."}</strong> ${esc(item.why)}</p></div>`
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function choice(s) {
    const picked = getAnswer("choice");
    const chosen = s.choices.find((c) => c.id === picked);
    const locked = Boolean(chosen);
    return `
      <div class="stack">
        ${s.choices
          .map((c) => {
            let cls = picked === c.id ? "picked" : "";
            if (locked && c.id === picked) cls = c.correct ? "right" : "wrong";
            if (locked && c.correct) cls = "right";
            return `<button class="choice ${cls}" data-choice="${c.id}" ${locked ? "disabled" : ""}>${esc(c.label)}</button>`;
          })
          .join("")}
        ${
          chosen
            ? `<div class="feedback ${chosen.correct ? "ok" : "bad"}"><p>${esc(chosen.correct ? s.ok : s.bad)}</p></div>`
            : ""
        }
      </div>
    `;
  }

  function sort(s) {
    const a = state.answers[s.id] || {};
    const held = a.held;
    const checked = a.checked;
    const unused = s.items.filter((item) => !a[item.id]);
    return `
      <div class="stack">
        <p class="note">Drag a case into a bin. Drag it back to the list if you change your mind.</p>
        <div class="pool" data-bin="pool">
          ${unused
            .map(
              (item) =>
                `<button class="chip ${held === item.id ? "held" : ""} ${state.flashId === item.id ? "in" : ""}" data-hold="${item.id}">${esc(item.text)}</button>`
            )
            .join("")}
          ${unused.length ? "" : `<span class="note">Drop a case here to put it back.</span>`}
        </div>
        <div class="bins">
          ${s.bins
            .map((bin) => {
              const inside = s.items.filter((item) => a[item.id] === bin.id);
              return `
                <div class="bucket" data-bin="${bin.id}">
                  <h3>${esc(bin.label)}</h3>
                  ${inside
                    .map((item) => {
                      const ok = item.bin === bin.id;
                      const cls = [
                        checked ? (ok ? "right" : "wrong") : "",
                        state.flashId === item.id ? "in" : "",
                      ].join(" ");
                      return `<button class="item ${cls}" data-hold="${item.id}">${esc(item.text)}</button>`;
                    })
                    .join("")}
                </div>
              `;
            })
            .join("")}
        </div>
        ${
          s.items.every((item) => a[item.id]) && !checked
            ? `<button class="btn soft" type="button" data-sort-check="1">Check</button>`
            : ""
        }
        ${
          checked
            ? `<div class="feedback ok"><div class="stack">${s.items
                .map((item) => `<p><strong>${esc(item.text)}</strong> ${esc(item.why)}</p>`)
                .join("")}</div></div>`
            : ""
        }
      </div>
    `;
  }

  function match(s) {
    const a = state.answers[s.id] || {};
    const pairs = a.pairs || {};
    const used = new Set(Object.values(pairs));
    const held = a.held;
    const words = s.pairs.filter((p) => !pairs[p.id]);
    const meanings = s.pairs.filter((p) => !used.has(p.id));
    const done = Object.keys(pairs).length === s.pairs.length;
    const paired = s.pairs.filter((p) => pairs[p.id]);
    return `
      <div class="match">
        <div class="stack" data-pool="1">
          ${words
            .map(
              (p) =>
                `<button class="word ${held === p.id ? "on" : ""}" data-word="${p.id}">${esc(p.word)}</button>`
            )
            .join("")}
        </div>
        <div class="stack">
          ${meanings
            .map(
              (p) =>
                `<button class="meaning" data-meaning="${p.id}">${esc(p.meaning)}</button>`
            )
            .join("")}
        </div>
      </div>
      ${
        paired.length
          ? `<div class="pool paired">${paired
              .map(
                (p) =>
                  `<button class="chip" data-unpair="${p.id}">${esc(p.word)} — ${esc(p.meaning)}</button>`
              )
              .join("")}</div>`
          : ""
      }
      ${
        done
          ? `<div class="feedback ok" style="margin-top:1rem"><p>Correct. Use each word in only this sense when you write.</p></div>`
          : ""
      }
    `;
  }

  function checklist(s) {
    const a = state.answers[s.id] || {};
    const all = s.items.every((_, i) => a["k" + i]);
    return `
      <div class="stack">
        ${s.items
          .map((item, i) => {
            const on = Boolean(a["k" + i]);
            return `<button class="check-item ${on ? "on" : ""}" data-check="${i}"><strong>${i + 1}.</strong> ${esc(item)}</button>`;
          })
          .join("")}
        ${
          all
            ? `<div class="feedback warn"><div class="prose">${paras(s.after)}</div></div>`
            : ""
        }
      </div>
    `;
  }

  function steps(s) {
    const a = state.answers[s.id] || {};
    return `
      <div class="steps">
        ${s.steps
          .map((step, i) => {
            const open = Boolean(a["st" + i]);
            return `
              <button class="step ${open ? "open" : ""}" data-step="${i}">
                <div class="step-num">Step ${esc(step.num)}</div>
                <strong>${esc(step.title)}</strong>
                ${open ? `<p class="why">${esc(step.body)}</p>` : `<p class="why">Open this step.</p>`}
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function desk(s) {
    const a = state.answers[s.id] || {};
    const current = Math.min(a.at || 0, s.questions.length - 1);
    const q = s.questions[current];
    const picked = a[q.id];
    const chosen = q.choices.find((c) => c.id === picked);
    const more = Boolean(chosen) && current < s.questions.length - 1;
    return `
      <div class="stack">
        <section class="desk" aria-label="Task desk">
          <div class="desk-top">
            <span>Flag ${current + 1} of ${s.questions.length} on this case</span>
            <span>Read the transcript. Then answer.</span>
          </div>
          <div class="desk-grid">
            <div class="desk-col">
              <h3>Request</h3>
              <p>${esc(s.request.user)}</p>
              <ul class="findings">${s.request.asks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
            <div class="desk-col">
              <h3>Flag</h3>
              <p class="flag-title">${esc(s.flag.title)}</p>
              <p>${esc(s.flag.body)}</p>
              <ul class="findings">${s.flag.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
            <div class="desk-col">
              <h3>Transcript</h3>
              ${s.transcript
                .map(
                  (t) =>
                    `<div class="turn ${t.role}"><div class="who">${esc(t.who)}</div><p>${esc(t.text)}</p></div>`
                )
                .join("")}
            </div>
          </div>
        </section>
        <div class="card">
          <p class="kicker">${esc(q.tag)}</p>
          <h2>${esc(q.prompt)}</h2>
          <div class="stack">
            ${q.choices
              .map((c) => {
                let cls = "";
                if (chosen) {
                  if (c.correct) cls = "right";
                  else if (c.id === picked) cls = "wrong";
                }
                return `<button class="choice ${cls}" data-desk="${q.id}" data-val="${c.id}" ${chosen ? "disabled" : ""}><span class="tag">${esc(q.tag)}</span>${esc(c.label)}</button>`;
              })
              .join("")}
          </div>
        </div>
        ${
          chosen
            ? `<div class="feedback ${chosen.correct ? "ok" : "bad"}"><p>${esc(chosen.correct ? q.ok : q.bad)}</p></div>`
            : ""
        }
        ${
          more
            ? `<button class="btn soft" type="button" data-desk-next="1">Next question</button>`
            : ""
        }
      </div>
    `;
  }

  function axes(s) {
    const a = state.answers[s.id] || {};
    const picked = new Set(a.pick || []);
    const checked = Boolean(a.checked);
    const extra = [...picked].filter((id) => !s.allow.includes(id));
    const ok = extra.length === 0;
    return `
      <div class="stack">
        <div class="axes">
          ${s.axes
            .map((axis) => {
              const on = picked.has(axis.id);
              let cls = on ? "on" : "";
              if (checked && on && s.allow.includes(axis.id)) cls = "right";
              if (checked && on && !s.allow.includes(axis.id)) cls = "wrong";
              return `<button class="axis ${cls}" data-axis="${axis.id}" ${checked ? "disabled" : ""}>${esc(axis.id)}<small>${esc(axis.blurb)}</small></button>`;
            })
            .join("")}
        </div>
        <p class="note">You may pick none. That can be the right call.</p>
        ${
          !checked
            ? `<button class="btn soft" type="button" data-axes-check="1">Check</button>`
            : `<div class="feedback ${ok ? "ok" : "bad"}"><p>${esc(ok ? s.ok : s.bad)}</p></div>`
        }
      </div>
    `;
  }

  function severity(s) {
    const pick = getAnswer("sev");
    const locked = pick != null;
    const ok = s.accept.includes(pick);
    return `
      <div class="stack">
        <div class="card"><p>${esc(s.caseText)}</p></div>
        <div class="stack">
          ${s.options
            .map((opt) => {
              let cls = pick === opt.id ? "picked" : "";
              if (locked && s.accept.includes(opt.id)) cls = "right";
              if (locked && pick === opt.id && !ok) cls = "wrong";
              return `<button class="choice ${cls}" data-sev="${opt.id}" ${locked ? "disabled" : ""}><span class="tag">${opt.id}</span>${esc(opt.label)}</button>`;
            })
            .join("")}
        </div>
        ${
          locked
            ? `<div class="feedback ${ok ? "ok" : "bad"}"><p>${esc(ok ? s.ok : s.bad)}</p></div>`
            : ""
        }
      </div>
    `;
  }

  function compare(s) {
    const pick = getAnswer("score");
    const locked = pick != null;
    const ok = s.accept.includes(pick);
    const scale = [
      [-3, "A much better"],
      [-2, "A better"],
      [-1, "A slightly better"],
      [0, "Tie"],
      [1, "B slightly better"],
      [2, "B better"],
      [3, "B much better"],
    ];
    return `
      <div class="stack">
        <div class="grid-2">
          <article class="card"><p class="kicker">${esc(s.a.title)}</p><p>${esc(s.a.text)}</p></article>
          <article class="card"><p class="kicker">${esc(s.b.title)}</p><p>${esc(s.b.text)}</p></article>
        </div>
        <div class="scale">
          ${scale
            .map(([n, label]) => {
              let cls = pick === n ? "on" : "";
              if (locked && s.accept.includes(n)) cls = "right";
              if (locked && pick === n && !ok) cls = "wrong";
              return `<button class="score-btn ${cls}" data-score="${n}" ${locked ? "disabled" : ""}><b>${n > 0 ? "+" + n : n}</b><span>${esc(label)}</span></button>`;
            })
            .join("")}
        </div>
        ${
          locked
            ? `<div class="feedback ${ok ? "ok" : "bad"}"><p>${esc(ok ? s.ok : s.bad)}</p></div>`
            : ""
        }
      </div>
    `;
  }

  function fail(s) {
    const a = state.answers[s.id] || {};
    const pick = new Set(a.pick || []);
    const checked = Boolean(a.checked);
    const right = s.items.filter((i) => i.fail).map((i) => i.id);
    const ok =
      right.every((id) => pick.has(id)) && [...pick].every((id) => right.includes(id));
    return `
      <div class="stack">
        ${s.items
          .map((item) => {
            const on = pick.has(item.id);
            let cls = on ? "on" : "";
            if (checked && item.fail && on) cls = "right";
            if (checked && !item.fail && on) cls = "wrong";
            if (checked && item.fail && !on) cls = "wrong";
            return `<button class="check-item ${cls}" data-fail="${item.id}" ${checked ? "disabled" : ""}>${esc(item.text)}</button>`;
          })
          .join("")}
        ${
          !checked
            ? `<button class="btn soft" type="button" data-fail-check="1">Check</button>`
            : `<div class="feedback ${ok ? "ok" : "bad"}"><p>${esc(ok ? s.ok : s.bad)}</p></div>`
        }
      </div>
    `;
  }

  function done(s) {
    const minutes = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
    const acc = state.score.tried
      ? Math.round((state.score.correct / state.score.tried) * 100)
      : 0;
    return `
      <p class="kicker">${esc(s.kicker)}</p>
      <h1>${esc(s.title)}</h1>
      <div class="done-box">
        <div class="prose">${paras(s.body)}</div>
        <div class="statline">
          <div><b>${acc}%</b><span>First-try accuracy</span></div>
          <div><b>${state.score.correct}/${state.score.tried}</b><span>Correct calls</span></div>
          <div><b>${minutes}m</b><span>Time on this primer</span></div>
        </div>
        <div class="grid-2">
          <article class="pocket-card">
            <p class="kicker">Pocket · words</p>
            ${COURSE.pocket.words.map(([w, m]) => `<p><strong>${esc(w)}.</strong> ${esc(m)}</p>`).join("")}
          </article>
          <article class="pocket-card">
            <p class="kicker">Pocket · axes</p>
            ${COURSE.pocket.axes.map(([w, m]) => `<p><strong>${esc(w)}.</strong> ${esc(m)}</p>`).join("")}
          </article>
        </div>
        <div class="card links">
          <p><a href="${esc(COURSE.source.url)}" target="_blank" rel="noreferrer">Open the v4 document</a></p>
          <p><a href="${esc(COURSE.form)}" target="_blank" rel="noreferrer">Google Form after you submit a task</a></p>
          <p><a href="${esc(COURSE.alignerr)}" target="_blank" rel="noreferrer">Alignerr sign in</a></p>
          <p><a href="${esc(COURSE.profile)}" target="_blank" rel="noreferrer">Vercel profile</a></p>
        </div>
        <button class="btn soft" type="button" data-reset="1">Start the primer again</button>
      </div>
    `;
  }

  function bind(s) {
    root.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", () => go(Number(el.dataset.go)));
    });
    root.querySelectorAll("[data-jump]").forEach((el) => {
      el.addEventListener("click", () => jump(Number(el.dataset.jump)));
    });
    root.querySelectorAll("[data-card]").forEach((el) => {
      el.addEventListener("click", () => {
        const i = Number(el.dataset.card);
        const val = el.dataset.val === "yes";
        const item = s.items[i];
        setAnswer("c" + i, val, true);
        mark(val === item.answer, "c" + i);
      });
    });
    root.querySelectorAll("[data-choice]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.dataset.choice;
        const choice = s.choices.find((c) => c.id === id);
        setAnswer("choice", id, true);
        mark(Boolean(choice && choice.correct), "choice");
      });
    });
    root.querySelectorAll("[data-hold]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const held = getAnswer("held");
        const parentBin = el.closest("[data-bin]");
        if (held && parentBin) {
          placeSort(held, parentBin.dataset.bin);
          return;
        }
        setAnswer("held", el.dataset.hold);
      });
    });
    root.querySelectorAll("[data-bin]").forEach((el) => {
      el.addEventListener("click", () => {
        const held = getAnswer("held");
        if (!held) return;
        placeSort(held, el.dataset.bin);
      });
    });
    root.querySelectorAll("[data-sort-check]").forEach((el) => {
      el.addEventListener("click", () => {
        const a = state.answers[s.id] || {};
        const ok = s.items.every((item) => a[item.id] === item.bin);
        setAnswer("checked", true, true);
        mark(ok);
      });
    });
    root.querySelectorAll("[data-word]").forEach((el) => {
      el.addEventListener("click", () => setAnswer("held", el.dataset.word));
    });
    root.querySelectorAll("[data-meaning]").forEach((el) => {
      el.addEventListener("click", () => {
        const held = getAnswer("held");
        if (!held) return;
        if (held !== el.dataset.meaning) {
          setAnswer("held", null, true);
          mark(false, "miss-" + held + "-" + el.dataset.meaning);
          return;
        }
        const pairs = { ...(getAnswer("pairs") || {}) };
        pairs[held] = el.dataset.meaning;
        setAnswer("pairs", pairs, true);
        setAnswer("held", null, true);
        mark(true, "pair-" + held);
      });
    });
    root.querySelectorAll("[data-check]").forEach((el) => {
      el.addEventListener("click", () => setAnswer("k" + el.dataset.check, true));
    });
    root.querySelectorAll("[data-step]").forEach((el) => {
      el.addEventListener("click", () => setAnswer("st" + el.dataset.step, true));
    });
    root.querySelectorAll("[data-desk]").forEach((el) => {
      el.addEventListener("click", () => {
        const q = s.questions.find((x) => x.id === el.dataset.desk);
        const choice = q.choices.find((c) => c.id === el.dataset.val);
        setAnswer("q", q.id, true);
        setAnswer(q.id, el.dataset.val, true);
        mark(Boolean(choice && choice.correct), q.id);
      });
    });
    root.querySelectorAll("[data-desk-next]").forEach((el) => {
      el.addEventListener("click", () => {
        setAnswer("at", (getAnswer("at") || 0) + 1);
      });
    });
    root.querySelectorAll("[data-axis]").forEach((el) => {
      el.addEventListener("click", () => {
        const pick = new Set(getAnswer("pick") || []);
        if (pick.has(el.dataset.axis)) pick.delete(el.dataset.axis);
        else pick.add(el.dataset.axis);
        setAnswer("pick", [...pick]);
      });
    });
    root.querySelectorAll("[data-axes-check]").forEach((el) => {
      el.addEventListener("click", () => {
        const pick = new Set(getAnswer("pick") || []);
        const extra = [...pick].filter((id) => !s.allow.includes(id));
        setAnswer("checked", true, true);
        mark(extra.length === 0);
      });
    });
    root.querySelectorAll("[data-sev]").forEach((el) => {
      el.addEventListener("click", () => {
        const n = Number(el.dataset.sev);
        setAnswer("sev", n, true);
        mark(s.accept.includes(n));
      });
    });
    root.querySelectorAll("[data-score]").forEach((el) => {
      el.addEventListener("click", () => {
        const n = Number(el.dataset.score);
        setAnswer("score", n, true);
        mark(s.accept.includes(n));
      });
    });
    root.querySelectorAll("[data-fail]").forEach((el) => {
      el.addEventListener("click", () => {
        const pick = new Set(getAnswer("pick") || []);
        if (pick.has(el.dataset.fail)) pick.delete(el.dataset.fail);
        else pick.add(el.dataset.fail);
        setAnswer("pick", [...pick]);
      });
    });
    root.querySelectorAll("[data-fail-check]").forEach((el) => {
      el.addEventListener("click", () => {
        const pick = new Set(getAnswer("pick") || []);
        const right = s.items.filter((i) => i.fail).map((i) => i.id);
        const ok = right.every((id) => pick.has(id)) && [...pick].every((id) => right.includes(id));
        setAnswer("checked", true, true);
        mark(ok);
      });
    });
    root.querySelectorAll("[data-reset]").forEach((el) => {
      el.addEventListener("click", () => {
        localStorage.removeItem(KEY);
        location.reload();
      });
    });
  }

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight") go(1);
    if (ev.key === "ArrowLeft") go(-1);
  });

  render();
})();
