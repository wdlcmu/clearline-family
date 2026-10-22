# Clearline Family — site changelog

## Quiz copy polish to Template v2 — 2026-10-22 (~12:30 PM PT)
Cold-user audit of the quiz itself (the homepage was already v2; the quiz
screens were not): every result component ran long — why-lines were single
14–27-word sentences, result "looks" text up to 44 words, trap cards up to
70 words, size notes up to 40, and the result screen ran 207–442 words
(avg 350) with TWO closing actions (Start over + a "Read the traps" link).
Polish, copy only — scoring, traps, flags, and option order untouched
(structure diff before/after: identical):
- All 231 quiz sentences now ≤10 words (was: 4 question screens and nearly
  every result string over). Result copy FK ~8.2 → ~2.5 (vowel-group approx).
- Why-lines rebuilt as three short sentences; the composed why no longer
  repeats the "families like yours often look at X" line, which already
  sits directly above the result name.
- DIME size notes kept, re-cut to short steps that lead with the user's
  Q3 worry. Trap substance kept (MEC both sides, face-minus-loan, paid-up
  vs matured, settlement "certain", $50K group line, caregiver pricing).
- Result screen: 138–287 words (avg 233), ONE closing action (Start over).
- Path enumeration re-run on the shipped logic: 207,360 valid paths,
  0 dead ends, all 6 results reachable; every question changes the full
  outcome on 25.5–100% of comparisons (headline on 3.1–51%; Q9's job is
  the payout trap/education, Q5 is the strongest signal at 51%).
Still open (Billy's call, unchanged): homepage FAQ keeps the page at
~436–452 visible words vs the ≤300 budget — move FAQ to /how-it-works
or exempt it.

## Quiz state-awareness + honest time claim — 2026-10-22 (11:49 AM PT)
Billy dogfooded the Check and found Q8 offering "I have no policy" to people
who had already said they have one. Fix: an optionVisible() state filter —
later options that assume an individually owned policy (Q7 "already have
money in a policy", Q8 loan / paid-up) or deny having one (Q8 "I have no
policy") now only appear when they do not contradict the Q4 coverage answer.
Job-only (group) users no longer see the loan / paid-up options either.
Path enumeration (Billy's quiz gate) over the shipped logic: 207,360 valid
paths, 0 contradictions, 0 dead ends, all 6 results reachable; the old logic
had 414,720 paths with contradictions in 6 audited categories, incl. 12,120
paths that ended on "review the policy you have" for someone with no policy
of their own. Also: the "2 minute check" claim was not true (Billy's own run
ran over) — button is now "Start the check", microcopy and the /how-it-works
and /traps ledes now say "about 2 to 3 minutes", and the tap lock dropped
450ms -> 200ms (fast taps on the next question were being swallowed).
Deployed via clearline-deploy-ext.py (worker "clearline-site", 2026-10-22
18:49 UTC; the path returns no version id) and verified in the fetched live
pages: byte-identical to source, gate re-run against the live file PASS.

## FAQ restored — 2026-10-22 (11:01 AM PT)
The "Common questions" FAQ section (5 questions, incl. DIME and the plain
"not advice" answer) and its FAQPage JSON-LD, added in the morning sprint,
were removed by the Template v2 rebuild below. Restored additively below the
"Who we are" section at the direction of the correction pass; hero and nav
untouched. Deployed via clearline-deploy-ext.py (worker "clearline-site";
the script returns no version id) and verified in the fetched live homepage:
all five questions and "FAQPage" present, live bytes identical to source.

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
