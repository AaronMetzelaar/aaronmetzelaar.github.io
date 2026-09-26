# Het Broederschap der Kruisridders

A modern replacement for the 2004 kruisridders.nl
([archived](https://web.archive.org/web/20040605053248/http://www.kruisridders.nl/index2.htm)),
built as a standalone static site. It has no build step and no dependencies,
so the folder can be moved into its own repository or put on any static host
as it is.

```bash
cd kruisridders && python3 -m http.server 8000   # http://localhost:8000
```

## What's here

| File              | Purpose                                                             |
| ----------------- | ------------------------------------------------------------------- |
| `index.html`      | The whole site, one page, in Dutch                                  |
| `styles.css`      | Design tokens at the top (`:root`), change the colours there        |
| `main.js`         | Optional extras: mobile menu, active menu link, reveal fallback     |
| `fonts/`          | Self-hosted Instrument Serif and Inter (SIL OFL, licences included) |
| `assets/seal.svg` | Favicon                                                             |

## Still to fill in

Every placeholder renders as red `[bracketed]` text so nothing unfinished
goes live by accident. Search `index.html` for `class="todo"`:

- [ ] Number of members (stats row)
- [ ] Annual traditions (Dinsdag → "En verder")
- [ ] Names and neighbourhoods of the seven houses (no street addresses)
- [ ] Screenshot of the 2004 site → `assets/kruisridders-2004.png` (instructions in a comment in the "Toen & nu" section)
- [ ] NoNoMes vertrouwenspersoon contact details
- [ ] Contact details for the reunion association
- [ ] Instagram link
- [ ] Check that `info@kruisridders.nl` is the right address (it is a guess)

## Sources for the copy

Everything that isn't a placeholder comes from public sources: the current
kruisridders.nl, nonomes.nl and NoNoMes' Wikisage entry. That covers the
founding year (1989), being the oldest dispuut of S.V.A.A. NoNoMes, the seven
houses, Tuesdays at Café Internationaal followed by the society, and the
"open, loyaal en ambitieus" values.
The 2004 site itself could not be read when this was built. Check the copy
against it before publishing.

## What "2026-appropriate" means here

- **The emblem is the St Andrew's cross (×××) from the Amsterdam coat of arms**,
  not a crusader cross. The name stays, but the site avoids militant crusader
  imagery. It ties "kruis" to the city instead. Replace it with the real
  crest if the dispuut has one.
- **"Onze afspraken"** covers respect, an introduction period without
  humiliation, alcohol as a free choice, consent before posting photos or
  names, and a point of contact for concerns.
- **Privacy**: no house addresses, no member names or photos, no cookies,
  no trackers, and no third-party requests. Fonts are self-hosted instead of
  loaded from Google Fonts.
- **Accessible**: semantic landmarks, a skip link, visible focus, and
  support for `prefers-reduced-motion`. Every section works without JavaScript.
