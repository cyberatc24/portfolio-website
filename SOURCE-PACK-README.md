# Ruturaj — Portfolio

A long-scroll personal portfolio for a creative technologist: a studio-lit portrait hero, a filterable work
archive with an accessible dialog, a pinned "one builder, three sides" chapter, a services bento, a
first-frame/last-frame film breakdown, a data-pipeline diagram, a pinned agents rail, a product spotlight,
a journey accordion, a scroll-speed marquee and a contact section. A Motion switch in the header stills
every animation.

The page ships with its owner's own content (Ruturaj Jena, Brand Motion Studios). Replace all of it with
yours before you publish: name, portrait, roles, links, phone, email and work.

## Run it

The built site is already here: `index.html` with `Asset/dist/app.js` and `Asset/dist/app.css`.
Serve the folder with any static server:

```
npx serve .
```

or `python -m http.server 8000`, then open the address it prints. Upload the folder to any static host and
it is live.

## Change it

```
npm install
npm run dev
```

`npm run dev` bundles `src/` into `Asset/dist/` with esbuild and serves the folder. After an edit, run
`npm run build` and reload.

## Files

- `index.html`: the shell, meta tags and the `<noscript>` fallback.
- `src/app.jsx`: header, hero, ticker, work archive, tools rail, film breakdown, about, journey, contact,
  footer and the project dialog.
- `src/extras.jsx` + `src/extras.css`: the three-sides chapter, services bento, data-pipeline diagram,
  agents rail, product spotlight and the marquee.
- `src/styles.css`: the design system and the core sections.
- `src/shared.js`: the Motion context and the one ease used everywhere.
- `src/data/projects.json`: every piece of work. `src/data/brands.json`: the tools rail.
- `Asset/img/`: the portrait (transparent PNG), favicon and the two film-breakdown frames.
  `Asset/svg/`: tool icons and the tools-rail logos.

## Make it yours

- **Name and hero:** the `Hero` component in `src/app.jsx`. Swap `Asset/img/ruturaj-portrait.png` for your
  own cut-out portrait at a similar 2:3 framing, and update the preload in `index.html`.
- **Work:** edit `src/data/projects.json`. `type` is `website`, `youtube`, `drive`, `image` or `render`
  (a `render` carries `renders: [{ solid, final }]` for the breakdown). `category` feeds the filters, which
  are listed in `categories` at the top of `src/app.jsx`. `featured` picks the three cards shown first.
- **Three sides:** the `chapters` array at the top of the Signal section in `src/extras.jsx`. Each row of
  `type` is a list of `[kind, text]`, where kind is `o` outline, `g` gradient, `s` solid, `i` serif
  italic, `m` mono label or `p` pill.
- **Services, pipeline stages, agents, product features, journey, milestones:** small arrays near each
  component (`services`, `STAGES`, `FLOW`, `features`, `experiences`, `certificates`).
- **Contact:** the email, Instagram, phone and the WhatsApp number in `Contact` and the footer.
- **Colours and type:** custom properties at the top of `src/styles.css` (`--bg`, `--red`, `--lilac`,
  `--peach`, `--grad`) and the Google Fonts link in `index.html`.

## Motion

Every animated component reads `MotionContext`. The header button stores the choice in localStorage
(`rj-motion`) and sets `html[data-motion]`, and the OS reduced-motion setting turns motion off too.
With motion off the page still reads completely: entrances show at once, pinned sections unpin and loops
stop.

## Notes

- Everything is HTML text and CSS, with no canvas or WebGL, so screenshots and screen readers see all of it.
- Work images load from their own URLs (here, brandmotion.dev). Host your own and point `image` at them.
- The product spotlight's phone is a CSS illustration, labelled as a concept. Replace it with real
  screenshots once you have them.
- Tested at 1440, 768, 390 and 320px with Motion on and off. Safari and real phones were not tested.
