(function () {
  function parseAnswer(text) {
    const blocks = [];
    for (const raw of String(text).split("\n")) {
      if (!raw.trim()) continue;
      const nested = /^\s{2,}- /.test(raw);
      const line = raw.trim();
      const last = blocks[blocks.length - 1];
      if (nested && last && last.type !== "p" && last.items.length) {
        last.items[last.items.length - 1].children.push(line.replace(/^- /, ""));
        continue;
      }
      const type = line.startsWith("- ") ? "ul" : /^\d+\.\s/.test(line) ? "ol" : "p";
      const item = { text: line.replace(/^- /, "").replace(/^\d+\.\s/, ""), children: [] };
      if (last && last.type === type && type !== "p") last.items.push(item);
      else blocks.push({ type, items: [item] });
    }
    return blocks;
  }

  function renderInline(text) {
    const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    const out = [];
    let cursor = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (match.index > cursor) out.push(document.createTextNode(text.slice(cursor, match.index)));
      if (match[3] !== undefined) {
        const strong = document.createElement("strong");
        strong.textContent = match[3];
        out.push(strong);
      } else {
        const a = document.createElement("a");
        a.textContent = match[1];
        a.href = match[2];
        if (!match[2].startsWith("mailto:")) {
          a.target = "_blank";
          a.rel = "noreferrer";
        }
        out.push(a);
      }
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) out.push(document.createTextNode(text.slice(cursor)));
    return out;
  }

  function fill(el, nodes) {
    el.textContent = "";
    nodes.forEach((node) => el.appendChild(node));
  }

  function renderAnswer(text) {
    const wrap = document.createElement("div");
    wrap.className = "a";
    parseAnswer(text).forEach((block, index) => {
      if (block.type === "p") {
        const p = document.createElement("p");
        if (index === 0) p.style.marginTop = "12px";
        fill(p, renderInline(block.items[0].text));
        wrap.appendChild(p);
        return;
      }
      const list = document.createElement(block.type);
      block.items.forEach((item) => {
        const li = document.createElement("li");
        fill(li, renderInline(item.text));
        if (item.children.length) {
          const nested = document.createElement("ul");
          item.children.forEach((child) => {
            const childLi = document.createElement("li");
            fill(childLi, renderInline(child));
            nested.appendChild(childLi);
          });
          li.appendChild(nested);
        }
        list.appendChild(li);
      });
      wrap.appendChild(list);
    });
    return wrap;
  }

  const state = { query: "", group: "all", openId: null };

  function visible() {
    const pool = state.group === "all" ? FAQ : FAQ.filter((item) => item.group === state.group);
    return searchFaqDetailed(pool, state.query);
  }

  function setHash(id) {
    if (id) history.replaceState(null, "", "#" + id);
    else history.replaceState(null, "", location.pathname + location.search);
  }

  function render() {
    const { items, partial } = visible();
    const chips = document.getElementById("chips");
    chips.textContent = "";
    FAQ_GROUPS.forEach((group) => {
      const count = group.id === "all" ? FAQ.length : FAQ.filter((row) => row.group === group.id).length;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (state.group === group.id ? " on" : "");
      btn.innerHTML = group.label + "<span>" + count + "</span>";
      btn.addEventListener("click", () => {
        state.group = group.id;
        render();
      });
      chips.appendChild(btn);
    });

    const q = state.query.trim();
    const count = document.getElementById("count");
    if (partial) {
      count.textContent = "Closest " + (items.length === 1 ? "match" : "matches") + (q ? " for “" + q + "”" : "");
    } else {
      count.textContent =
        items.length +
        (items.length === 1 ? " question" : " questions") +
        (q ? " matching “" + q + "”" : "");
    }

    const list = document.getElementById("list");
    list.textContent = "";
    items.forEach((item) => {
      const open = state.openId === item.id;
      const article = document.createElement("article");
      article.className = "item" + (open ? " open" : "");
      article.id = item.id;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "q";
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.innerHTML =
        '<span class="q-text"></span><span class="q-toggle">' + (open ? "HIDE" : "ANSWER") + "</span>";
      button.querySelector(".q-text").textContent = item.q;
      button.addEventListener("click", () => {
        state.openId = open ? null : item.id;
        setHash(state.openId);
        render();
        if (state.openId) {
          const el = document.getElementById(state.openId);
          if (el) el.scrollIntoView({ block: "nearest" });
        }
      });
      article.appendChild(button);
      if (open) {
        article.appendChild(renderAnswer(item.a));
        if (item.href) {
          const more = document.createElement("a");
          more.className = "more";
          more.href = item.href;
          more.textContent = (item.hrefLabel || "Open") + " →";
          if (!item.href.startsWith("mailto:")) {
            more.target = "_blank";
            more.rel = "noreferrer";
          }
          article.querySelector(".a").appendChild(more);
        }
      }
      list.appendChild(article);
    });

    const empty = document.getElementById("empty");
    empty.hidden = items.length > 0;
  }

  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    state.query = search.value;
    state.group = "all";
    render();
  });

  function applyHash() {
    const hash = location.hash.replace(/^#/, "");
    if (!hash || !FAQ.some((item) => item.id === hash)) return false;
    state.openId = hash;
    state.group = "all";
    state.query = "";
    search.value = "";
    return true;
  }

  applyHash();
  window.addEventListener("hashchange", () => {
    if (applyHash()) {
      render();
      const el = document.getElementById(state.openId);
      if (el) el.scrollIntoView({ block: "start" });
    }
  });

  render();
  if (state.openId) {
    const el = document.getElementById(state.openId);
    if (el) el.scrollIntoView({ block: "start" });
  }
})();
