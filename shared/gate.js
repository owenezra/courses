(function () {
  const STORAGE = "lv-courses-auth";
  const TOKEN = "granted:pairwise-2026";
  const HASH = "fc803f00f59ee76fd44aa5e1efb9da1b2a223dbba98dc322c5df67cabc964afe";

  function unlocked() {
    try {
      return localStorage.getItem(STORAGE) === TOKEN;
    } catch {
      return false;
    }
  }

  function grant() {
    localStorage.setItem(STORAGE, TOKEN);
  }

  function lock() {
    try {
      localStorage.removeItem(STORAGE);
    } catch {
      /* ignore */
    }
  }

  async function digest(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function loginView() {
    return `
      <style>
        .gate {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 1.5rem;
          background: #f7f7f7;
          font-family: Nunito, "Segoe UI", sans-serif;
          color: #3c3c3c;
        }
        .gate-card {
          width: min(24rem, 100%);
          background: #fff;
          border: 2px solid #e5e5e5;
          border-bottom-width: 4px;
          border-radius: 16px;
          padding: 1.5rem 1.4rem 1.35rem;
        }
        .gate-card h1 {
          margin: 0 0 0.4rem;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .gate-card p {
          margin: 0 0 1rem;
          color: #777;
          font-weight: 700;
        }
        .gate-card label {
          display: block;
          font-size: 0.82rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }
        .gate-card input {
          width: 100%;
          box-sizing: border-box;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          padding: 0.7rem 0.8rem;
          font: inherit;
          font-weight: 700;
        }
        .gate-card input:focus {
          outline: none;
          border-color: #1cb0f6;
        }
        .gate-card button {
          width: 100%;
          margin-top: 0.9rem;
          border: 2px solid #46a302;
          border-bottom-width: 4px;
          background: #58cc02;
          color: #fff;
          border-radius: 16px;
          padding: 0.7rem 1rem;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }
        .gate-error {
          min-height: 1.2rem;
          margin: 0.55rem 0 0;
          color: #ea2b2b;
          font-weight: 800;
          font-size: 0.92rem;
        }
      </style>
      <main class="gate">
        <form class="gate-card" id="gate-form">
          <h1>Pairwise v4</h1>
          <p>This course is locked. Enter the course password.</p>
          <label for="gate-pass">Password</label>
          <input id="gate-pass" name="password" type="password" autocomplete="current-password" autofocus />
          <p class="gate-error" id="gate-error" hidden>Not correct.</p>
          <button type="submit">Open</button>
        </form>
      </main>
    `;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const input = document.getElementById("gate-pass");
    const error = document.getElementById("gate-error");
    const guess = (input && input.value) || "";
    const hex = await digest(guess);
    if (hex !== HASH) {
      if (error) error.hidden = false;
      if (input) {
        input.value = "";
        input.focus();
      }
      return;
    }
    grant();
    location.reload();
  }

  function mountLogin() {
    document.documentElement.lang = "en";
    if (!document.querySelector('link[href*="Nunito"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap";
      document.head.appendChild(link);
    }
    document.title = "Courses · locked";
    document.body.innerHTML = loginView();
    const form = document.getElementById("gate-form");
    if (form) form.addEventListener("submit", onSubmit);
  }

  window.CoursesGate = { unlocked, lock, grant };

  if (!unlocked()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountLogin);
    } else {
      mountLogin();
    }
  }
})();
