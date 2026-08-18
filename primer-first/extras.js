(function () {
  const root = document.getElementById("app");
  const mode = document.body.dataset.mode;
  if (!root || !mode) return;

  function extrasUnlocked() {
    try {
      if (localStorage.getItem("brv-dev-mode") === "1") return true;
      const s = JSON.parse(localStorage.getItem("brv-course-progress") || "{}");
      return !!(s.fq && s.fq.sub);
    } catch {
      return false;
    }
  }

  if (!extrasUnlocked()) {
    root.innerHTML = `
      <p class="kicker">LOCKED</p>
      <h1>Finish the final quiz first</h1>
      <p class="lead">These extra pages open after you submit the final quiz in the course.</p>
      <a class="btn" href="../">← COURSE</a>`;
    return;
  }

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const fetchJson = (name) =>
    fetch("../data/" + name).then((r) => {
      if (!r.ok) throw new Error("Could not load " + name);
      return r.json();
    });

  function choicesHtml(choices, picked, correct) {
    return choices
      .map((c) => {
        let cls = "choice";
        if (picked != null) {
          if (c.id === correct) cls += " right";
          else if (c.id === picked) cls += " wrong";
        }
        return `<button type="button" class="${cls}" data-choice="${esc(c.id)}" ${
          picked != null ? "disabled" : ""
        }>${esc(c.label)}</button>`;
      })
      .join("");
  }

  function renderCascade(data) {
    let ix = -1;
    let qi = 0;
    const answers = {};

    const key = (s, q) => s + ":" + q;

    function home() {
      ix = -1;
      root.innerHTML = `
        <p class="kicker">OPTIONAL · ENCOURAGED</p>
        <h1>Harder core-judgment drills</h1>
        <p class="lead">Tougher flags to judge, start to finish. The six questions live in the primer module <strong>Six questions per flag</strong>. These drills only apply them.</p>
        <section class="card tech">
          <div class="label">TECHNIQUE</div>
          <h2>Set your own standard</h2>
          <p>One way to apply the six questions — not a new rule.</p>
          <p style="margin-top:12px;color:var(--body)">Before you follow the hypothesizer's references, use the user's request, the task context, and the flag to form your own standard. For each behavior the flag criticizes, decide what a good model should have done. Then compare the transcript with that standard. If the transcript matches, that claim is not valid.</p>
          <p style="margin-top:10px;font-weight:800;color:var(--ink)">Set your own ideal behavior first. Treat the hypothesizer's references as evidence, not as the standard.</p>
        </section>
        <p class="meta" style="margin:0 0 10px">WORKED EXAMPLES</p>
        <div class="grid">
          ${data.samples
            .map(
              (s, i) => `
            <button type="button" class="card" data-open="${i}">
              <div class="meta">SAMPLE ${i + 1} · ${s.questions.length} QUESTIONS</div>
              <h2>${esc(s.title)}</h2>
              <p>${esc(s.teaches)}</p>
            </button>`,
            )
            .join("")}
        </div>`;
      root.querySelectorAll("[data-open]").forEach((btn) => {
        btn.addEventListener("click", () => {
          ix = Number(btn.dataset.open);
          qi = 0;
          drawSample();
        });
      });
    }

    function drawSample() {
      const sample = data.samples[ix];
      const q = sample.questions[qi];
      const k = key(sample.id, qi);
      const picked = answers[k];
      const done = qi >= sample.questions.length;

      if (done) {
        const hits = sample.questions.filter((qq, i) => answers[key(sample.id, i)] === qq.answer).length;
        root.innerHTML = `
          <p class="kicker">SAMPLE ${ix + 1} COMPLETE</p>
          <h1>${esc(sample.title)}</h1>
          <p class="lead">First-try answers: ${hits} of ${sample.questions.length}.</p>
          <div class="row">
            <button type="button" class="btn ghost" id="home">All samples</button>
            ${ix + 1 < data.samples.length ? `<button type="button" class="btn" id="next">Next sample</button>` : ""}
          </div>`;
        document.getElementById("home").onclick = home;
        const n = document.getElementById("next");
        if (n)
          n.onclick = () => {
            ix += 1;
            qi = 0;
            drawSample();
          };
        return;
      }

      root.innerHTML = `
        <p class="kicker">SAMPLE ${ix + 1} · QUESTION ${qi + 1} OF ${sample.questions.length}</p>
        <h1>${esc(sample.title)}</h1>
        <div class="req">
          <h3>THE REQUEST</h3>
          <div>${esc(sample.task.summary)}</div>
          <ul>${sample.task.asks.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>
        <div class="flag">
          <h3>THE FLAG</h3>
          <div>${esc(sample.description)}</div>
          ${
            sample.findings?.length
              ? `<ul>${sample.findings.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
              : ""
          }
        </div>
        ${
          sample.evidence?.length
            ? `<div class="quote"><h3>EVIDENCE</h3>${sample.evidence
                .map((e) => `<p>“${esc(e.quote)}” <span class="meta">${esc(e.note || "")}</span></p>`)
                .join("")}</div>`
            : ""
        }
        <section class="card" style="margin-top:16px">
          <div class="meta">${esc(q.tag)}</div>
          <h2>${esc(q.prompt)}</h2>
          ${q.hint ? `<p>${esc(q.hint)}</p>` : ""}
          <div id="choices">${choicesHtml(q.choices, picked, q.answer)}</div>
          ${picked != null ? `<div class="feedback">${esc(q.explanation)}</div>` : ""}
        </section>
        <div class="row">
          <button type="button" class="btn ghost" id="home">All samples</button>
          ${picked != null ? `<button type="button" class="btn" id="cont">Continue</button>` : ""}
        </div>`;
      document.getElementById("home").onclick = home;
      const cont = document.getElementById("cont");
      if (cont)
        cont.onclick = () => {
          qi += 1;
          drawSample();
        };
      root.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (answers[k] != null) return;
          answers[k] = btn.dataset.choice;
          drawSample();
        });
      });
    }

    home();
  }

  function asChoices(q) {
    if (q.choices && typeof q.choices === "object" && !Array.isArray(q.choices) && q.choices.true) {
      return [
        { id: "true", label: q.choices.true },
        { id: "false", label: q.choices.false },
      ];
    }
    return [
      { id: "true", label: "Yes — a weakness in this axis" },
      { id: "false", label: "No — not this axis" },
    ];
  }

  function renderAxes(data) {
    const lessons = [
      ...data.weaknesses.map((w) => ({
        id: w.slug,
        name: w.name,
        tag: w.tag,
        drills: w.questions,
      })),
      { id: "applied", name: data.applied.title, tag: data.applied.tag, drills: data.applied.drills },
      { id: "overall", name: data.overall.title, tag: data.overall.tag, drills: data.overall.drills },
    ];
    let ix = -1;
    let qi = 0;
    const answers = {};

    function home() {
      ix = -1;
      root.innerHTML = `
        <p class="kicker">OPTIONAL · ENCOURAGED</p>
        <h1>Axes drills</h1>
        <p class="lead">Extra practice on the seven axes, mixed review, and the A/B call. The primer teaches the axes. These pages only add drills.</p>
        ${lessons
          .map(
            (l, i) => `
          <button type="button" class="card" data-open="${i}">
            <div class="meta">${i + 1} · ${esc(l.tag).toUpperCase()} · ${l.drills.length} DRILLS</div>
            <h2>${esc(l.name)}</h2>
          </button>`,
          )
          .join("")}`;
      root.querySelectorAll("[data-open]").forEach((btn) => {
        btn.addEventListener("click", () => {
          ix = Number(btn.dataset.open);
          qi = 0;
          draw();
        });
      });
    }

    function draw() {
      const lesson = lessons[ix];
      if (qi >= lesson.drills.length) {
        const hits = lesson.drills.filter((d, i) => {
          const want = d.answer === true ? "true" : d.answer === false ? "false" : String(d.answer);
          return answers[lesson.id + ":" + i] === want;
        }).length;
        root.innerHTML = `
          <p class="kicker">DRILLS COMPLETE</p>
          <h1>${esc(lesson.name)}</h1>
          <p class="lead">First-try answers: ${hits} of ${lesson.drills.length}.</p>
          <div class="row">
            <button type="button" class="btn ghost" id="home">All axis drills</button>
            ${ix + 1 < lessons.length ? `<button type="button" class="btn" id="next">Next set</button>` : ""}
          </div>`;
        document.getElementById("home").onclick = home;
        const n = document.getElementById("next");
        if (n)
          n.onclick = () => {
            ix += 1;
            qi = 0;
            draw();
          };
        return;
      }
      const q = lesson.drills[qi];
      const opts = asChoices(q);
      const correct = q.answer === true ? "true" : q.answer === false ? "false" : String(q.answer);
      const k = lesson.id + ":" + qi;
      const picked = answers[k];
      root.innerHTML = `
        <p class="kicker">${esc(lesson.name).toUpperCase()} · ${qi + 1} OF ${lesson.drills.length}</p>
        <h1>${esc(lesson.name)}</h1>
        <p class="lead">${esc(lesson.tag)}</p>
        <section class="card">
          <p style="margin:0;color:var(--ink);font-size:15.5px;font-weight:700;line-height:1.55">${esc(q.scenario)}</p>
          <div id="choices">${choicesHtml(opts, picked, correct)}</div>
          ${picked != null ? `<div class="feedback">${esc(q.explanation)}</div>` : ""}
        </section>
        <div class="row">
          <button type="button" class="btn ghost" id="home">All axis drills</button>
          ${picked != null ? `<button type="button" class="btn" id="cont">Continue</button>` : ""}
        </div>`;
      document.getElementById("home").onclick = home;
      const cont = document.getElementById("cont");
      if (cont)
        cont.onclick = () => {
          qi += 1;
          draw();
        };
      root.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (answers[k] != null) return;
          answers[k] = btn.dataset.choice;
          draw();
        });
      });
    }

    home();
  }

  function renderBank(data) {
    const TIER = {
      cascade: "Core judgment",
      axes: "Seven axes",
      compare: "A/B comparison",
      process: "Review quality",
    };
    let catId = null;
    let qi = 0;
    const answers = {};

    function itemsFor(id) {
      return data.items.filter((it) => it.categoryId === id);
    }

    function home() {
      catId = null;
      const tiers = ["cascade", "axes", "compare", "process"];
      root.innerHTML = `
        <p class="kicker">OPTIONAL · ENCOURAGED</p>
        <h1>Practice bank</h1>
        <p class="lead">${data.items.length} extra examples and boundary cases. The primer owns the rules. These items only apply them.</p>
        ${tiers
          .map((tier) => {
            const cats = data.categories.filter((c) => c.tier === tier);
            if (!cats.length) return "";
            return `
              <p class="meta" style="margin:22px 0 8px">${esc(TIER[tier]).toUpperCase()}</p>
              ${cats
                .map((c) => {
                  const n = itemsFor(c.id).length;
                  return `
                    <button type="button" class="card" data-cat="${esc(c.id)}">
                      <div class="meta">${n} ITEM${n === 1 ? "" : "S"}</div>
                      <h2>${esc(c.name)}</h2>
                      <p>${esc(c.short)}</p>
                    </button>`;
                })
                .join("")}`;
          })
          .join("")}`;
      root.querySelectorAll("[data-cat]").forEach((btn) => {
        btn.addEventListener("click", () => {
          catId = btn.dataset.cat;
          qi = 0;
          draw();
        });
      });
    }

    function stimulus(item) {
      if (item.flagged) {
        const f = item.flagged;
        return `
          ${
            f.request
              ? `<div class="req"><h3>THE REQUEST</h3><div>${esc(f.request.summary || f.request.title || "")}</div></div>`
              : ""
          }
          <div class="flag"><h3>THE FLAG</h3><div>${esc(f.description)}</div>
            ${f.findings?.length ? `<ul>${f.findings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          </div>`;
      }
      return item.scenario ? `<p style="margin:0 0 10px;font-weight:700;color:var(--ink);line-height:1.55">${esc(item.scenario)}</p>` : "";
    }

    function draw() {
      const cat = data.categories.find((c) => c.id === catId);
      const items = itemsFor(catId);
      if (qi >= items.length) {
        const hits = items.filter((it, i) => answers[it.id] === String(it.answer)).length;
        root.innerHTML = `
          <p class="kicker">SET COMPLETE</p>
          <h1>${esc(cat.name)}</h1>
          <p class="lead">First-try answers: ${hits} of ${items.length}.</p>
          <div class="row"><button type="button" class="btn ghost" id="home">All practice</button></div>`;
        document.getElementById("home").onclick = home;
        return;
      }
      const item = items[qi];
      const opts = [
        { id: "true", label: item.choices.true },
        { id: "false", label: item.choices.false },
      ];
      const correct = String(item.answer);
      const picked = answers[item.id];
      root.innerHTML = `
        <p class="kicker">${esc(cat.name).toUpperCase()} · ${qi + 1} OF ${items.length}</p>
        <h1>${esc(cat.name)}</h1>
        <section class="card">
          ${stimulus(item)}
          <h2 style="margin-top:12px">${esc(item.prompt)}</h2>
          <div>${choicesHtml(opts, picked, correct)}</div>
          ${picked != null ? `<div class="feedback">${esc(item.explanation)}</div>` : ""}
        </section>
        <div class="row">
          <button type="button" class="btn ghost" id="home">All practice</button>
          ${picked != null ? `<button type="button" class="btn" id="cont">Continue</button>` : ""}
        </div>`;
      document.getElementById("home").onclick = home;
      const cont = document.getElementById("cont");
      if (cont)
        cont.onclick = () => {
          qi += 1;
          draw();
        };
      root.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (answers[item.id] != null) return;
          answers[item.id] = btn.dataset.choice;
          draw();
        });
      });
    }

    home();
  }

  function renderGlossary(data) {
    root.innerHTML = `
      <p class="kicker">OPTIONAL · ENCOURAGED</p>
      <h1>Glossary</h1>
      <p class="lead">Unique terms used in the instructions. Axis terms are not here — the primer owns those.</p>
      ${data.terms
        .map(
          (t) => `
        <section class="card term">
          <h2>${esc(t.term)}</h2>
          <p>${esc(t.definition)}</p>
          <div class="example"><div class="meta">EXAMPLE</div>${esc(t.example)}</div>
        </section>`,
        )
        .join("")}
      <section class="card" style="margin-top:16px">
        <h2>Remember</h2>
        <p>These terms are not behavioral axes. They only help you read the instructions. Judge the model's behavior against the user's request, the evidence, and the effects of the model's actions.</p>
      </section>`;
  }

  const loaders = {
    cascade: () => fetchJson("cascade.json").then(renderCascade),
    axes: () => fetchJson("axes.json").then(renderAxes),
    bank: () => fetchJson("bank.json").then(renderBank),
    glossary: () => fetchJson("glossary.json").then(renderGlossary),
  };

  const load = loaders[mode];
  if (!load) {
    root.textContent = "Unknown extra page.";
    return;
  }
  load().catch((err) => {
    root.innerHTML = `<p class="lead">${esc(err.message)}</p>`;
  });
})();
