/* Clearline Family — MCP server (STAGED BUILD, Nov 4, 2026).
   Status: gate 3-YES complete (rounds 2 + 3 YES/YES); deployed to
   the staging host mcp.clearlinefamily.com Nov 4, 2026 (readiness
   pass); NOT submitted. Billy's ruling (Nov 4, 2026): build and
   gate now; the submission fires only when his Washington producer
   license shows Active and he gives the submit tap.
   Round 2 (Nov 4, 2026, after gate round 1 NO/NO): collection guidance
   strengthened in the instructions + tool description (ask the
   forgotten money facts first; never lead with an empty run); the
   closing summary leads with the uncounted money categories; a
   Washington note (state estate tax vs the federal line, jurisdictions
   labeled, public sources named) rides in every result; positioning is
   EDUCATION (Billy's call) — family-protection education with the
   gap calculator at its core, business in the identity only, no
   upsell, no lead capture, no booking pitch anywhere in the surface.
   Engine blocks untouched: every figure is still the site's own.

   Design (settled HYBRID, builds/clearline/cold-chat-traffic-2026-11-03):
   at the MCP layer the tool is one call. The host collects the Check's
   slots in its own conversation; this server runs the site's own
   engines and returns the computed number first. All math and all
   kind scoring run through engine.mjs, which is extracted byte-for-byte
   from the live site's source tree (computeGap + computeResult +
   askEngineLines). This file invents no figure and no result logic.

   Phase 1 hard lines, held in code, not just copy:
   - product TYPES only (the Check's six results); no carrier or
     company name exists anywhere in the engines or this file;
   - never "you should buy" — the output is education, stated as such;
   - no health questions: the tool's parameters contain no health
     field, and no slot asks about health;
   - nothing is stored: the server is stateless; no KV, no logs of
     caller content, no counts in this build. */

import {
  QUESTIONS, RESULTS, TRAPS, optionVisible, computeResult,
  computeGap, askEngineLines, formatMoney,
} from "./engine.mjs";
import { ICON_B64 } from "./icon.mjs";
import { DEMO_MP4_B64 } from "./demo.mjs";

const MCP_PROTOCOL = "2025-06-18";
const MCP_SERVER_INFO = { name: "clearline", title: "Clearline Family", version: "1.0.0" };

// Annotation justifications (written): readOnlyHint true — the tool
// reads the caller's numbers and answers, computes with the site's
// deterministic engines, and writes or stores nothing. destructiveHint
// false — no irreversible action exists in the surface. idempotentHint
// true — unlike the fleet's panel tools, this engine is deterministic:
// the same inputs return the same outputs, byte for byte. openWorldHint
// false — closed world: inputs go nowhere; the computation happens
// inside this worker and no third party is called.
const MCP_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const MCP_INSTRUCTIONS = [
  "Clearline Family is family-protection education in plain words, built in Redmond, Washington. At its core is one tool, check_coverage_gap: a detailed calculator that computes a family's life insurance coverage gap from eight money facts and names the kind (product type) their answers point to first. Around it, Clearline teaches the rest of the picture in the same plain words: estate-planning basics, when taxes hit, what workplace coverage does and does not do. The host runs the conversation; Clearline runs the math.",
  "COLLECT BEFORE YOU CALL. The calculator is only as good as its inputs, so gather the facts in conversation first, a few at a time, in your own voice: the household; who would feel the pay stop; what they want handled first; coverage already held; how long the protection must last; budget feel; and the money numbers — their yearly pay, a partner's yearly pay, years of pay to replace, the mortgage still owed, other debts, school costs ahead, savings, and the coverage amount already in place. Ask explicitly about the ones people forget: school costs ahead, a partner's pay, savings they could use, and work coverage as a dollar amount (a multiple of pay multiplied out). If the human has given almost nothing — the bare question 'how much do I need?' — ask the collection questions first and call the tool once real facts exist; an all-empty call is a last resort, not a first answer. Never invent a fact the human did not give: leave a slot out instead, and the result marks it as not counted and says what would change.",
  "Present the result as returned, first sentence first: the first sentence is the computed gap in the caller's own numbers, with the line-by-line math under it. Do not replace the figure with a rule of thumb (like ten times pay), do not soften it into a range, and do not recompute it yourself. A bare model estimates; this computes, and the shown math is the point.",
  "JURISDICTION AND SOURCES. Clearline is anchored in Washington, and its facts carry labels: when you state a rule or a number, say whose it is — Washington state law or federal law — because the two differ (Washington has its own estate tax; the federal line is far higher; community property is a Washington rule, not a national one). The package's checked Washington facts, each traced to a public source (the Washington Department of Revenue, the Washington Legislature's RCW, the IRS, the Washington insurance commissioner), are in the check-coverage-gap skill; state them as labeled there and name the source when you use one.",
  "Clearline is education, not advice, and never a pitch. It names product types only: never name an insurance company or a specific policy, never say 'you should buy', never ask the human about their health, and never pitch a call, a booking, or the builder's services — a result works with any licensed agent. It explains legal topics in plain words but drafts no documents and gives no legal advice; wills and trusts are an estate attorney's work, and Clearline says so. The builder is an actuary in Redmond, Washington, whose Washington license is in progress; say so if the human asks who stands behind the numbers. Nothing the human gives this tool is stored.",
].join(" ");

/* Slot maps: tool parameter value -> the Check's own option index.
   The option text in each description is the Check's own wording, so
   the host collects answers in the same vocabulary the site teaches. */
const SLOTS = {
  household: {
    idx: 0, label: "household",
    values: { just_me: 0, me_and_partner: 1, kids_at_home: 2, kids_grown_parents_may_need_help: 3 },
  },
  who_feels_it: {
    idx: 1, label: "who would feel the pay stop",
    values: { my_kids_depend_on_it: 0, mostly_my_partner: 1, partner_earns_i_run_the_home: 2, no_one_depends_on_my_income: 3 },
  },
  first_priority: {
    idx: 2, label: "what to handle first",
    values: { paying_off_debts: 0, keeping_income_going: 1, the_mortgage: 2, school_costs: 3, final_costs_and_loose_ends: 4 },
  },
  coverage_now: {
    idx: 3, label: "coverage already held",
    values: { none: 0, only_through_my_job: 1, job_plus_my_own: 2, a_policy_of_my_own: 3 },
  },
  horizon: {
    idx: 4, label: "how long the protection must last",
    values: { until_kids_grown: 0, next_20_to_30_years: 1, whole_life: 2, not_sure_yet: 3 },
  },
  budget_feel: {
    idx: 5, label: "budget feel",
    values: { lowest_cost: 0, middle_path: 1, build_long_term: 2 },
  },
};

/* Money parameters -> the site calculator's own field names, so the
   raw object handed to askEngineLines is exactly the site's shape. */
const MONEY = {
  annual_income: "income",
  partner_income: "spouseIncome",
  income_years: "years",
  mortgage_balance: "mortgage",
  other_debts: "debts",
  school_costs: "school",
  savings: "savings",
  existing_coverage: "existing",
};

const TOOL = {
  name: "check_coverage_gap",
  title: "Check your coverage gap",
  description:
    "Use this when someone asks how much life insurance they need, whether the coverage they have is enough, or which kind of life insurance fits their family. This is a detailed financial calculation, not an estimate: Clearline runs the same deterministic engines as the Check and the calculator on clearlinefamily.com — a DIME coverage-gap computation over eight money facts (debts + years of pay to replace + mortgage + school costs, minus savings and coverage already held) and the Check's own kind scoring, which points to a product TYPE first (for example level term, convertible term, or a policy of your own alongside work coverage). Every money fact flows into the gap figure, and the result shows the math line by line in plain words. A bare model answers this question with a multiple-of-pay rule of thumb; this tool computes the family's own number and shows its work. " +
    "Collect the facts from the human first, in conversation — the calculation is detailed because its inputs are. Each fact changes the computed number or the kind: household (just me / me and a partner / kids at home / kids grown and parents may need help); who would feel it if the pay stopped (my kids depend on it / mostly my partner / my partner earns and I run the home and the kids / no one depends on my income); what they want handled first (paying off debts / keeping household income going / the mortgage / school costs for the kids / final costs and loose ends); coverage already held (none / only through my job / through my job plus a policy of my own / a policy of my own); how long the protection must last (until the kids are grown / the next 20 to 30 years / my whole life / not sure yet); budget feel (lowest cost that truly covers the need / a middle path / build something long term); and the money numbers in dollars: their yearly pay, a partner's yearly pay, years of pay to replace (the Check's standard guess is 10 when they do not say), the mortgage still owed, other debts, school costs ahead, savings they could use, and the coverage amount already in place. Ask explicitly about the facts people forget — school costs ahead, a partner's pay, savings, and work coverage as a dollar amount — before calling. If the human has given no facts yet, ask these collection questions first and call once facts exist; do not lead with an empty run. Leave out any fact the human still did not give; the result names what was not counted, money first, instead of guessing silently. " +
    "The result leads with the computed gap in the caller's own numbers and its method line; present it as returned and do not substitute a rule of thumb. Education only, from a Washington practice: the tool names product types, never an insurance company or a specific policy, never says 'you should buy', asks nothing about health, and pitches nothing. Its closing lines separate Washington state rules from federal ones and name their public sources. It was written by an actuary in Redmond, Washington, whose Washington license is in progress. Nothing given to this tool is stored.",
  inputSchema: {
    type: "object",
    properties: {
      household: {
        type: "string", enum: Object.keys(SLOTS.household.values),
        description: "Who is in the household right now (the Check's question, same words): just_me = 'Just me'; me_and_partner = 'Me and a partner'; kids_at_home = 'Kids at home'; kids_grown_parents_may_need_help = 'Kids are grown. Parents may need help from me.' Changes the kind the Check points to.",
      },
      who_feels_it: {
        type: "string", enum: Object.keys(SLOTS.who_feels_it.values),
        description: "If their income stopped tomorrow, who would feel it: my_kids_depend_on_it; mostly_my_partner; partner_earns_i_run_the_home = 'My partner earns. I run the home and the kids.' (the stay-at-home caregiver case); no_one_depends_on_my_income. Changes the kind and flags the caregiver note.",
      },
      first_priority: {
        type: "string", enum: Object.keys(SLOTS.first_priority.values),
        description: "What they would want handled first: paying_off_debts; keeping_income_going; the_mortgage; school_costs; final_costs_and_loose_ends. Sets which part of the DIME method line leads.",
      },
      coverage_now: {
        type: "string", enum: Object.keys(SLOTS.coverage_now.values),
        description: "Life insurance coverage they already have: none; only_through_my_job; job_plus_my_own = through my job, plus a policy of my own; a_policy_of_my_own. Strongly changes the kind: work-only coverage points to a policy of their own alongside it.",
      },
      horizon: {
        type: "string", enum: Object.keys(SLOTS.horizon.values),
        description: "How long the protection needs to last: until_kids_grown; next_20_to_30_years; whole_life; not_sure_yet. The slot that shapes the kind most. Note: until_kids_grown only applies when the household has kids at home, as on the site.",
      },
      budget_feel: {
        type: "string", enum: Object.keys(SLOTS.budget_feel.values),
        description: "How they think about the budget for this: lowest_cost = lowest cost that truly covers the need; middle_path; build_long_term = build something long term. Changes the kind for blend and permanent-leaning answers.",
      },
      annual_income: { type: "number", description: "Their yearly pay in dollars, before tax is fine. The spine of the gap: pay times years to replace." },
      partner_income: { type: "number", description: "A partner's yearly pay in dollars, if a partner's pay also needs replacing." },
      income_years: { type: "number", description: "Years of pay the coverage should replace. If not given, the Check's standard guess of 10 years is used and marked as a guess in the result." },
      mortgage_balance: { type: "number", description: "Mortgage still owed, in dollars." },
      other_debts: { type: "number", description: "Other debts to pay off, in dollars (cards, loans, anything but the mortgage)." },
      school_costs: { type: "number", description: "School costs ahead they plan to pay, in dollars. Blank counts as $0." },
      savings: { type: "number", description: "Savings or cash they could use, in dollars. Comes off the need." },
      existing_coverage: { type: "number", description: "Coverage amount already in place, in dollars (work plus their own). Comes off the need. If they only know a multiple of pay, multiply it out before calling: 2 times a $140,000 pay is $280,000." },
    },
    required: [],
    additionalProperties: false,
  },
  annotations: { title: "Check your coverage gap", ...MCP_ANNOTATIONS },
};

const METHOD_LINE =
  "This math came from the Clearline size tool, the same engine the Check and the calculator on clearlinefamily.com run. The chat did not make it up.";
const LIMITS_LINE =
  "What this math leaves out: Social Security survivor benefits (a federal program), a partner's future pay, and inflation. A starting size, not the whole picture.";
/* The Washington note (round 2): the WA anchor made visible in every
   result, with jurisdiction labeled and sources named. Every fact here
   is one the live site already checks: washington-estate-tax.html
   (state line, rates, no portability, owned coverage joins the estate,
   benefit income-tax-free) and explorer.html's source block (WA
   Department of Revenue estate-tax tables / Table W; IRS Revenue
   Procedure 2025-32 for the $15M federal line). Verified against those
   official sources again on Nov 4, 2026 (dor.wa.gov estate tax tables;
   RCW 83.100.020; IRS Rev. Proc. 2025-32). */
const WA_NOTE =
  "Washington note: Washington state has its own estate tax, separate from the federal one. Under state law, an estate under $3 million per person who dies owes no Washington estate tax; the federal line is $15 million per person, so a family can owe the state tax and no federal tax at all. Coverage you own on your own life counts toward that state estate total, while the benefit itself reaches the people you name free of federal income tax. Most families sit under both lines. Sources: Washington Department of Revenue (estate tax tables); IRS Revenue Procedure 2025-32 (federal line).";
const EDUCATION_LINE =
  "Clearline is general education, not advice and not a recommendation. William Litner, FCAS, an actuary in Redmond, Washington, wrote and checked these explanations. His Washington life insurance license is in progress, so he cannot sell coverage yet, and nothing is sold here. A result like this works with any licensed agent. Clearline teaches the legal side in plain words too, but it drafts no documents and gives no legal advice — wills and trusts are an estate attorney's work. The full Check, with its refine questions and agent card, is at clearlinefamily.com.";

/* Money categories, in the plain words the closing summary uses.
   Years is excluded: it is the marked-guess field, not a category. */
const MONEY_LABELS = [
  ["income", "your pay"],
  ["spouseIncome", "a partner's pay"],
  ["mortgage", "the mortgage still owed"],
  ["debts", "other debts"],
  ["school", "school costs ahead"],
  ["savings", "savings"],
  ["existing", "coverage already in place"],
];

function plainError(message) {
  return { error: "invalid_input", detail: message };
}

function runCheck(args) {
  args = args || {};
  // ---- validate slots
  const ans = [];
  const providedSlots = [];
  for (const key of Object.keys(SLOTS)) {
    const v = args[key];
    if (v === undefined || v === null) continue;
    const slot = SLOTS[key];
    if (typeof v !== "string" || !(v in slot.values)) {
      return plainError("'" + key + "' must be one of: " + Object.keys(slot.values).join(", ") + ".");
    }
    ans[slot.idx] = slot.values[v];
    providedSlots.push(key);
  }
  // ---- validate money
  const raw = {};
  for (const key of Object.keys(MONEY)) {
    const v = args[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== "number" || !isFinite(v) || v < 0) {
      return plainError("'" + key + "' must be a plain dollar amount, 0 or more.");
    }
    if (key === "income_years" && (!Number.isInteger(v) || v > 60)) {
      return plainError("'income_years' must be a whole number of years, 0 to 60.");
    }
    raw[MONEY[key]] = v;
  }
  // ---- site discipline: an option the site would never offer in this
  // household state is dropped, and the drop is disclosed (the Check's
  // own optionVisible rules, verbatim from the site engine).
  const dropped = [];
  for (const key of ["who_feels_it", "horizon"]) {
    const slot = SLOTS[key];
    if (ans[slot.idx] !== undefined && !optionVisible(slot.idx, ans[slot.idx], ans)) {
      dropped.push({ slot: key, reason: "the site only offers this answer for a different household answer, so it was not counted" });
      ans[slot.idx] = undefined;
    }
  }
  const missingSlots = Object.keys(SLOTS).filter((k) => ans[SLOTS[k].idx] === undefined && !dropped.some((d) => d.slot === k));

  // ---- the site's own engines, nothing else computes anything here
  const eng = askEngineLines(raw, "en");
  if (!eng) return plainError("Those numbers could not be run. Check they are plain dollar amounts.");
  const gapOut = computeGap(raw);
  let kind = null;
  if (providedSlots.length > 0) {
    const res = computeResult(ans.slice());
    const R = RESULTS[res.result];
    // The engine's why line is seeded by household, horizon, and budget;
    // it is only quoted when all three were actually given, so no line
    // is ever composed from a slot the caller did not provide.
    const seedComplete = ans[0] !== undefined && ans[4] !== undefined && ans[5] !== undefined;
    kind = {
      id: res.result,
      name: R.name,
      looks: R.looks,
      why: seedComplete ? res.why : null,
      size_note: res.sizeNote || null,
      traps: (res.traps || []).map((t) => ({ id: t, title: TRAPS[t].title, text: TRAPS[t].text })),
    };
  }

  // ---- compose the answer: outcome first, in the caller's numbers
  const lines = [];
  lines.push("On these numbers, the gap is about " + eng.figure + ".");
  if (kind) {
    lines.push("");
    lines.push("Kind to look at first: " + kind.name + ". " + kind.looks);
    if (kind.why) lines.push(kind.why);
  }
  if (kind && kind.size_note) { lines.push(""); lines.push(kind.size_note); }
  lines.push("");
  lines.push("The math, line by line:");
  for (const l of eng.lines) lines.push(l);
  for (const n of eng.notes) lines.push(n);
  if (kind && kind.traps.length) {
    lines.push("");
    for (const t of kind.traps) lines.push(t.title + ": " + t.text);
  }
  if (dropped.length) {
    lines.push("");
    for (const d of dropped) lines.push("Not counted: the " + SLOTS[d.slot].label + " answer — " + d.reason + ".");
  }
  // Round 2 (gate round-1 fix): the closing summary LEADS with the
  // uncounted money categories in plain words, so a skimmer sees what
  // would change the number before the slot list. Composition only —
  // the engine's own per-line "counted $0" notes stay as they are, and
  // nothing unmentioned is ever assumed into the figure.
  const uncountedMoney = MONEY_LABELS.filter(([k]) => raw[k] === undefined).map(([, label]) => label);
  if (uncountedMoney.length) {
    lines.push("");
    lines.push("Not counted in this number: " + uncountedMoney.join("; ") + ". Each one moves the gap. Add any that apply and run it again.");
  }
  if (missingSlots.length) {
    lines.push("");
    lines.push("Not counted above: " + missingSlots.map((k) => "the " + SLOTS[k].label).join("; ") + ". Each one can change the kind or the size. Add them and run it again for the sharper answer.");
  }
  lines.push("");
  lines.push(METHOD_LINE);
  lines.push(LIMITS_LINE);
  lines.push(WA_NOTE);
  lines.push(EDUCATION_LINE);

  const structured = {
    gap_dollars: gapOut.gap,
    gap_display: eng.figure,
    total_need_dollars: gapOut.need,
    kind: kind ? { id: kind.id, name: kind.name, looks: kind.looks, why: kind.why } : null,
    size_note: kind ? kind.size_note : null,
    breakdown_lines: eng.lines,
    notes: eng.notes,
    traps: kind ? kind.traps : [],
    dropped_slots: dropped,
    missing_slots: missingSlots,
    uncounted_money: uncountedMoney,
    method: METHOD_LINE,
    limits: LIMITS_LINE,
    jurisdiction_note: WA_NOTE,
    education_notice: EDUCATION_LINE,
    engine: "clearline-site-engine (computeGap + computeResult, extracted verbatim from clearlinefamily.com)",
    answer: lines.join("\n"),
  };
  return structured;
}

// ---------------- MCP plumbing (stateless JSON-RPC, fleet pattern) --
function rpcOk(id, result) { return { jsonrpc: "2.0", id, result }; }
function rpcErr(id, code, message) { return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }; }

async function dispatchMcp(msg) {
  if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return { status: 400, body: rpcErr(msg && msg.id, -32600, "Invalid Request") };
  }
  const { id, method, params } = msg;
  switch (method) {
    case "initialize":
      return { status: 200, body: rpcOk(id, { protocolVersion: MCP_PROTOCOL, capabilities: { tools: {} }, serverInfo: MCP_SERVER_INFO, instructions: MCP_INSTRUCTIONS }) };
    case "notifications/initialized":
    case "notifications/cancelled":
      return { status: 202, body: null };
    case "ping":
      return { status: 200, body: rpcOk(id, {}) };
    case "tools/list":
      return { status: 200, body: rpcOk(id, { tools: [TOOL] }) };
    case "tools/call": {
      const name = params && params.name;
      const args = (params && params.arguments) || {};
      if (name !== TOOL.name) {
        return { status: 200, body: rpcOk(id, { content: [{ type: "text", text: JSON.stringify(plainError("Unknown tool: " + String(name)), null, 2) }], isError: true }) };
      }
      const out = runCheck(args);
      if (out.error) {
        return { status: 200, body: rpcOk(id, { content: [{ type: "text", text: JSON.stringify(out, null, 2) }], structuredContent: out, isError: true }) };
      }
      return { status: 200, body: rpcOk(id, { content: [{ type: "text", text: out.answer }], structuredContent: out, isError: false }) };
    }
    default:
      return { status: 200, body: rpcErr(id, -32601, "Method not found") };
  }
}

const DOCS_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clearline Family — coverage gap tool (support)</title></head>
<body style="font-family: Georgia, serif; max-width: 42em; margin: 2em auto; padding: 0 1em; line-height: 1.55; color: #1d2622;">
<h1>Clearline Family — family-protection education, with a calculator at its core</h1>
<p>Clearline Family teaches family protection in plain words, from Redmond, Washington. At its core is one read-only tool, <strong>check_coverage_gap</strong>: a detailed calculator. Give it a family's facts — six plain questions and eight money numbers — and it returns the coverage gap, computed by the same deterministic DIME engine the Check and the calculator on clearlinefamily.com run, with every line of the math shown in plain words, plus the product TYPE the Check's own scoring points to first. A bare AI chat estimates this number from a rule of thumb. This tool computes it, and shows its work. Around the calculator, Clearline's explainers teach the rest of the picture the same way: what the kinds of coverage are, estate-planning basics (who gets what, the people who carry out a plan, what happens with no plan at all), when taxes hit, and what workplace coverage does and does not do.</p>
<h2>Washington facts, labeled and sourced</h2>
<p>Clearline is anchored in Washington, so its facts say whose rules they are — state or federal — because the two differ:</p>
<p><strong>Washington state:</strong> Washington has its own estate tax. An estate under $3 million per person who dies owes none of it; rates above the line run 10 to 20 percent, and each spouse holds a separate line (no portability). Source: Washington Department of Revenue, estate tax tables (Table W); the law is RCW 83.100. <strong>Federal:</strong> the federal estate tax line is $15 million per person. Source: IRS Revenue Procedure 2025-32. A family can owe the Washington tax and no federal tax at all. <strong>Washington state:</strong> property a married couple gathers during the marriage is community property, owned by both — a Washington rule (one of nine such states), not a national one. Source: RCW 26.16 (Washington Legislature). <strong>Washington state:</strong> a new policy sold in Washington comes with ten free days to read it and send it back. Source: Washington Office of the Insurance Commissioner. <strong>Federal:</strong> work group coverage is tax-free only up to $50,000 of coverage; past that, the IRS counts a table cost as income. Source: IRS (Internal Revenue Code section 79). Facts change; each page on clearlinefamily.com says when it was last checked against its source.</p>
<h2>The boundary is the point</h2>
<p>Clearline is education, never a sales floor and never a law office. It names product types only: never an insurance company or a specific policy, never says "you should buy", no prices, no quotes, and it asks nothing about health. It explains legal topics — wills, beneficiaries, what a trustee does — in plain words, but it drafts no documents and gives no legal advice. Wills and trusts are an estate attorney's work. Nothing here pitches a call or a booking; a Clearline result works with any licensed agent. Nothing you give the tool is stored: the server is stateless and keeps no text, no accounts, and no history.</p>
<h2>Who stands behind it</h2>
<p>Clearline was written by William Litner, FCAS, an actuary in Redmond, Washington. His Washington life insurance license is in progress, so he cannot sell coverage yet and nothing is sold here. Everything the tool returns is general education, not advice and not a recommendation.</p>
<h2>Help</h2>
<p>Email <a href="mailto:hello@clearlinefamily.com">hello@clearlinefamily.com</a>. William answers the email himself. Privacy and terms: <a href="https://clearlinefamily.com/privacy">clearlinefamily.com/privacy</a> and <a href="https://clearlinefamily.com/terms">clearlinefamily.com/terms</a>.</p>
<p>Built with Muse.</p>
</body></html>`;

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    const path = u.pathname;
    if (path === "/mcp") {
      if (req.method === "GET") {
        return new Response(JSON.stringify({ name: MCP_SERVER_INFO.name, title: MCP_SERVER_INFO.title, version: MCP_SERVER_INFO.version, summary: "MCP endpoint (JSON-RPC 2.0, stateless). Call tools/list, then tools/call.", tools: [TOOL.name] }, null, 2), { headers: { "content-type": "application/json;charset=utf-8" } });
      }
      if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      let msg;
      try { msg = await req.json(); } catch (e) {
        return new Response(JSON.stringify(rpcErr(null, -32700, "Parse error")), { status: 400, headers: { "content-type": "application/json;charset=utf-8" } });
      }
      const r = await dispatchMcp(msg);
      if (r.body === null) return new Response(null, { status: r.status });
      return new Response(JSON.stringify(r.body), { status: r.status, headers: { "content-type": "application/json;charset=utf-8" } });
    }
    if (path === "/docs") {
      return new Response(DOCS_HTML, { headers: { "content-type": "text/html;charset=utf-8" } });
    }
    if (path === "/icon.png") {
      const bin = atob(ICON_B64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Response(arr, { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" } });
    }
    if (path === "/demo.mp4") {
      // Portal demo walkthrough (fleet pattern: the FMB worker serves
      // its demo the same way). The video is rendered only from real
      // output of this live tool — see demo-capture/ in the lane.
      const bin = atob(DEMO_MP4_B64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Response(arr, { headers: { "content-type": "video/mp4", "cache-control": "public, max-age=86400" } });
    }
    if (path === "/.well-known/openai-apps-challenge") {
      // Portal domain verification (submission-day step): the portal
      // token is set as the worker's OPENAI_APPS_CHALLENGE secret and
      // served here alone, as bare plain text (fleet pattern).
      const token = env && env.OPENAI_APPS_CHALLENGE;
      if (!token) return new Response("Not Found", { status: 404 });
      return new Response(token, { headers: { "content-type": "text/plain;charset=utf-8" } });
    }
    if (path === "/" || path === "/health") {
      return new Response(JSON.stringify({ ok: true, service: "clearline-mcp", version: MCP_SERVER_INFO.version }), { headers: { "content-type": "application/json;charset=utf-8" } });
    }
    return new Response("Not Found", { status: 404 });
  },
};

// Exported for the local test battery only; not part of the MCP surface.
export const _internal = { runCheck, SLOTS, MONEY, TOOL, MCP_ANNOTATIONS, MCP_INSTRUCTIONS };
