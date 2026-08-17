# Courses

A catalog of short primers. Live at [learning.voyage/courses](https://learning.voyage/courses/).

Each course is a child of that path. The first course is [Pairwise v4](https://learning.voyage/courses/pairwise-v4/).

The catalog is open. Pairwise v4 is password locked. Use the same password as the other Pairwise course.

## Local

```bash
python3 -m http.server 3002
```

Open http://127.0.0.1:3002/ for the catalog, or http://127.0.0.1:3002/pairwise-v4/ for the course.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Catalog |
| `catalog.js` | List of courses |
| `shared/gate.js` | Password lock |
| `pairwise-v4/` | Pairwise v4 primer |

To add a course, see **[ADDING.md](ADDING.md)**.

## Pairwise v4

The live course is the Design Canvas build in `pairwise-v4/`.

Admin help (payment, Hubstaff, login) is at [`pairwise-v4/faq/`](https://learning.voyage/courses/pairwise-v4/faq/). Same password as the course. It is a separate lookup, linked from the top of the course home.

It teaches [Pairwise Coding Transcript Behavioral Review v4](https://docs.google.com/document/d/1Mjcz5h2WRNE5MfixA8_M3PPS0koer0RoZAJQxaPaLGc/edit) in Simplified Technical English.

An earlier primer is in `_archive/grok-primer/`.

To make a single-file copy you can send:

```bash
python3 scripts/package-ste.py
```

That writes `Pairwise Behavioral Review.html` and a zip to `~/Downloads`. Open the HTML in a browser. No server.
