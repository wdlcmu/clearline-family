# Clearline Family — site changelog

## Template v2 — 2026-10-22
Homepage rebuilt to Site Template v2 ("a 3rd grader gets it in 5 seconds"):
- Visible words 641 -> 141 (incl. footer). FAQ (302 words) and the How-it-works
  section removed from the homepage; the hero 3-step strip carries the "how".
- Two competing quiz starts (nav + hero) cut to ONE: the hero button.
  Nav "The Check" is now a plain anchor link.
- Hero: headline 5 words, subline 9 words, 1 button.
- Every remaining section <= 25 words (Traps 25, About 24).
- Sentences <= 10 words. Flesch-Kincaid grade 2.7 (was 6.0), measured with the
  standard syllable/FK implementation on the page's sentences; the legal line
  is exempt from the grade rule and stays one short block in the footer.
- Footer now carries the portfolio credit: "Built with Muse."
- PostHog added (pageviews only; autocapture off, session recording off,
  events tagged site=clearline-family). Quiz answers are never sent.
- Quiz engine unchanged (10 questions, types-only results, no carrier names,
  no health questions). Verified by hidden_files QA harness: structure +
  two full tap-through flows + 2,000 random engine paths.

## Parity rebuild — 2026-10-22 (earlier)
Hero and quiz card merged behind one green "Start the 2 minute check" CTA;
374 words claimed at the time. A same-day audit against the live page found
641 visible words and two wired start triggers, which Template v2 fixes above.

## Redesign — 2026-10-21
One CTA above the fold, intro card deleted, Estate Explorer promo cut from
the homepage, hero subline 39 -> 18 words.

## Addendum — 2026-10-22 17:55 UTC (parallel lane, recorded by the deploy lane)
Minutes after the Template v2 deploy, a parallel lane restored the FAQ section
(302 words) and its FAQPage schema to the homepage and redeployed
(backup: index.html.bak-2026-10-22-pre-faq-restore). Everything else from
Template v2 stands (one start, hero budgets, traps 25w, about 24w, PostHog,
footer credit). Current live totals with the FAQ: 452 visible words,
FK 5.1 — over the v2 page budget (<=300) and grade (<=3). The FAQ and the
budget cannot both hold on one page; this is a decision for Billy:
(a) move the FAQ to /how-it-works, or (b) keep it and exempt it.
Live md5 after restore: f961c2a8e6af14fb3673cfcbe344e19f.
