# Collective Designs — Codespaces restore

## Replace / add
1. `index.html` — patched current version.
2. `styles.css` — restored original base site styling from the last complete site tree.
3. `shop-preview.css` — restored product preview hover/focus styling.
4. `script.js` — restored navigation, mobile menu, product preview modal and year updater.
5. `site.webmanifest` — restored.
6. `robots.txt` — restored.
7. `sitemap.xml` — restored.

## Assets
- Keep `assets/moth.png` already present in the repository. The Night Garden cursor moths now explicitly use `assets/moth.png`.
- Keep the existing root `moth.png`; it is not removed so no existing feature is lost.
- Keep all existing `assets/*` files.

## What changed in index.html
- Restored the missing external stylesheet/script dependencies by supplying the files above.
- Word-search placement now has an exhaustive fallback, so a displayed word cannot silently be left unplaced.
- Word-search board gets explicit 10x10 grid rows/columns and pointer/touch-safe cell sizing.
- Night Garden cursor companions use the real moth artwork instead of emoji butterflies. Existing IDs/classes remain unchanged so the existing Night Garden JavaScript continues to control them.
- Added a final compatibility/layering style block so the restored base styling cannot cover Night Garden or game overlays.
- No existing feature blocks were deleted.

## Validation
- All 7 inline JavaScript blocks pass `node --check`.
- No duplicate HTML IDs were found.
- The existing 10x10 word-search rules, timer, reward flow, Night Garden, cat, candle, collectibles, private notes and Flappy Bat feature remain in the patched file.
