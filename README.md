# India By Era

A source-linked, chronological history of independent India, organised into six eras.

Live site: https://ashish-bhatia.github.io/IndiaByEra/

## Publishing

GitHub Pages serves the repository root from `main`. No custom GitHub Actions workflow or framework build is required. Keep `.nojekyll` in the root.

## Editing

1. Update `content.json`. Events contain a display date, sorting date, stable fragment identifier, title, topic, factual summary, editorial context and source keys.
2. Run `python3 scripts/build.py` to regenerate `index.html`.
3. Run `python3 scripts/check.py` and `node --check assets/app.js`.
4. Commit the content and generated HTML together to `main`.

`index.html` includes all history and sources. JavaScript adds chapter navigation, topic filters, search and story controls. Content remains readable without JavaScript. Curated “Read alongside” links connect related events across chapters without implying direct causation.

## Editorial scope

The current edition contains 233 selected milestones, with 280 source references, from August 1947 through April 2026. The review date is not a claim of complete coverage through October 2026. Era boundaries are editorial choices. The third chapter includes the 1989–1991 transition to avoid a gap before economic reform.

Programme announcements, legal enactment, commencement and measured results are different milestones. Context paragraphs contain editorial interpretation and should be reviewed alongside the linked records. Institutional records establish many dates and decisions but do not independently settle every assessment of outcomes.

## Design and access

Single dark editorial theme. Responsive chapter index, keyboard-operable disclosure controls, labelled search and filters, reduced-motion support, and print styling. Display fonts load from Google Fonts, with local serif and sans-serif fallbacks. No analytics, accounts, API keys or tracking scripts.

## Focused editorial passes

All six chapters have received a focused editorial pass. Eras 1–6 contain 41, 36, 36, 33, 37 and 50 milestones respectively. The latest pass deepens Era 6, 2014–present, with seven milestones covering agricultural markets, cooking fuel, Paris ratification, ration portability, rural water services, transgender-rights legislation and quantum research. The chapter overview now distinguishes programme coverage, service delivery and research milestones. Other era content and the April 2026 coverage cutoff were preserved. This completes the current sequence of focused passes across all six eras.
