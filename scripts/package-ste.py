#!/usr/bin/env python3
"""Build a single-file copy of the Pairwise Behavioral Review course."""
from __future__ import annotations

import base64
import gzip
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSE = ROOT / "pairwise-v4" / "index.html"
SUPPORT = ROOT / "pairwise-v4" / "support.js"
DONOR = Path("/Users/owen/Downloads/Behavioral Review Course.html")
OUT_DIR = Path("/Users/owen/Downloads")
OUT_HTML = OUT_DIR / "Pairwise Behavioral Review.html"
OUT_ZIP = OUT_DIR / "Pairwise Behavioral Review.zip"

README = """Pairwise Behavioral Review
==========================

Open "Pairwise Behavioral Review.html" in a browser. That is the whole course.
No install. No server. Works offline after the file is saved.

Hosted copy (password locked):
https://learning.voyage/courses/pairwise-v4/
"""


def load_donor_assets(path: Path) -> tuple[str, str, dict[str, bytes]]:
    html = path.read_text(encoding="utf-8")
    manifest = json.loads(
        re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.S).group(1).strip()
    )
    ext = json.loads(
        re.search(r'<script type="__bundler/ext_resources">(.*?)</script>', html, re.S).group(1).strip()
    )
    blobs: dict[str, bytes] = {}
    for uid, meta in manifest.items():
        raw = base64.b64decode(meta["data"])
        data = gzip.decompress(raw) if meta.get("compressed") else raw
        blobs[uid] = data

    by_url = {item["id"]: blobs[item["uuid"]] for item in ext}
    react = by_url["https://unpkg.com/react@18.3.1/umd/react.production.min.js"].decode("utf-8")
    react_dom = by_url["https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"].decode("utf-8")

    tmpl = json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.S).group(1).strip())
    font_css = re.search(r"<style>(/\* cyrillic-ext \*/.*?)</style>", tmpl, re.S).group(1)
    for uid, data in blobs.items():
        if not manifest[uid]["mime"].startswith("font/"):
            continue
        uri = "data:font/woff2;base64," + base64.b64encode(data).decode("ascii")
        font_css = font_css.replace(f'url("{uid}")', f"url({uri})")
    if "data:font/woff2" not in font_css:
        raise SystemExit("failed to inline fonts")
    return react, react_dom, font_css


def escape_script(js: str) -> str:
    return js.replace("</", "<\\/")


def course_body() -> str:
    text = COURSE.read_text(encoding="utf-8")
    text = text.replace('<script src="../shared/gate.js"></script>\n', "")
    text = text.replace('<script src="./support.js"></script>\n', "")
    text = re.sub(
        r'<link rel="preconnect" href="https://fonts\.googleapis\.com">.*?</link>\n?',
        "",
        text,
        count=1,
        flags=re.S,
    )
    # The Nunito stylesheet is a single link, not a pair. Strip it if still present.
    text = re.sub(
        r'<link rel="preconnect"[^>]*>\s*<link rel="preconnect"[^>]*>\s*<link href="https://fonts\.googleapis\.com/css2\?family=Nunito[^"]*" rel="stylesheet">\n?',
        "",
        text,
        count=1,
    )
    text = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?family=Nunito[^"]*" rel="stylesheet">\n?',
        "",
        text,
        count=1,
    )
    if "gate.js" in text or "./support.js" in text or "fonts.googleapis.com" in text:
        raise SystemExit("course still has external deps")
    return text


def build() -> Path:
    react, react_dom, font_css = load_donor_assets(DONOR)
    support = SUPPORT.read_text(encoding="utf-8")
    body = course_body()
    inner = re.search(r"<body>(.*)</html>\s*$", body, re.S)
    if not inner:
        raise SystemExit("could not split course body")
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Behavioral Review</title>
<style>{font_css}
body{{margin:0;background:#fdfaf3;color:#4a4238;}}
</style>
<script>{escape_script(react)}</script>
<script>{escape_script(react_dom)}</script>
<script>{escape_script(support)}</script>
</head>
<body>{inner.group(1)}
</html>
"""
    OUT_HTML.write_text(page)
    with zipfile.ZipFile(OUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(OUT_HTML, OUT_HTML.name)
        zf.writestr("README.txt", README)
    print("wrote", OUT_HTML, OUT_HTML.stat().st_size)
    print("wrote", OUT_ZIP, OUT_ZIP.stat().st_size)
    return OUT_HTML


if __name__ == "__main__":
    build()
