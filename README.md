# Pairwise v4 course

A 15 to 20 minute primer for people who are new to this task.

The course teaches [Pairwise Coding Transcript Behavioral Review v4](https://docs.google.com/document/d/1Mjcz5h2WRNE5MfixA8_M3PPS0koer0RoZAJQxaPaLGc/edit).

It is a friendly walk-through, not a lecture. You judge short cases. Then you see the rule. A light score tracks first-try calls.

Learner text follows ASD-STE100 writing rules. Project names stay as in the v4 document.

## Open the course

Open `index.html` in a browser.

Or start a local server:

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/

On GitHub Pages the course is at `https://owenezra.github.io/courses/`.

## What you do in the course

1. Judge short cases. Decide if a case is about behavior.
2. Learn the six words that this project uses.
3. Mark the four start steps.
4. Open the six steps in the tool.
5. Answer Q1 to Q6 on a simulated desk.
6. Put each behavior on the correct axis.
7. Compare two rollouts. See what fails a task.

A score tracks first-try calls. You can go back. Stations unlock as you go.

This course does not replace the v4 document. Use that document when you work.

## Source of the rules

All rules come from the v4 document. The course does not add new rules.

## Edit the course

- `js/content.js` holds the lessons and the checks.
- `js/app.js` runs the screens.
- `css/course.css` sets the look.

Write new learner text in STE. See `STE.md`.
