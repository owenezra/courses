# Add a course

Each course is a folder under this repo. GitHub Pages serves this repo at `https://learning.voyage/courses/`.

| Path in repo | Live URL |
|---|---|
| `index.html` | `https://learning.voyage/courses/` |
| `pairwise-v4/` | `https://learning.voyage/courses/pairwise-v4/` |
| `primer-first/` | `https://learning.voyage/courses/primer-first/` |
| `your-slug/` | `https://learning.voyage/courses/your-slug/` |

## Steps

1. Create a folder. Use a short slug: `pairwise-v4-studio`, `next-v2`, and so on.
2. Put the course `index.html` in that folder.
3. If this course should be locked, add this line in the `<head>`:

```html
<script src="../shared/gate.js"></script>
```

The catalog at `/courses/` stays open. Only pages that load `gate.js` ask for a password.

4. Register it in `catalog.js`:

```js
{
  slug: "your-slug",
  title: "Your title",
  blurb: "One or two sentences.",
  minutes: "15–20 min",
  status: "live",
}
```

Use `status: "soon"` to show a card that is not yet a link.

The password is not stored in this file.
