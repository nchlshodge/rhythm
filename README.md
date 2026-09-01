# Rhythm

A single-file PWA that helps people build a healthy daily rhythm of life with
Jesus — Scripture, prayer, and reflection, visualized as a tree that grows
over 30 days and a pasture that fills with sheep through acts of love.

## Structure

- `index.html` — the entire app (markup, styles, and logic in one file).
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — PWA install support.
- `month1.json` — source data for Month 1 ("Come: Learning from Jesus"), parsed from `rhythm_month1.docx`. It's compiled into the `MONTH1` constant in `index.html`; edit `month1.json` and re-embed it there if the content changes.
- `rhythm_month1.docx` — the original devotional manuscript for Month 1.

## Devotional content model

`DEVOTIONAL_MONTHS` in `index.html` maps a content-month number to a month's
data (`weekday`, `saturday`, `sunday` arrays). `getTodayDevotional()` picks
today's entry based on the real calendar date:

- Weekdays cycle sequentially through the month's `weekday` array, based on
  how many non-weekend days have occurred so far this calendar month.
- Saturdays and Sundays cycle through `saturday`/`sunday` by which
  occurrence of that weekday it is in the month (1st, 2nd, 3rd...).

Only Month 1 exists today. `getContentMonthNumber()` clamps to the highest
available month, so the app keeps using Month 1 content until Month 2+ is
added to `DEVOTIONAL_MONTHS`.

This sits alongside (not replacing) the existing 365-day NT/OT/Psalm reading
plan (`READING_PLAN`), which still drives the "Today's reading" / Scripture
practice card.

## Local development

No build step — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8934
```

Then visit `http://localhost:8934/index.html`.
