/* Clearline engines — extracted BYTE-FOR-BYTE from the live site's
   source-of-record tree (~/workspace/goals/income-diversification/files/
   clearline-website) by work/extract_engine.py on 2026-11-04.
   - ENGINE block (QUESTIONS, RESULTS, WHY pools, SIZE_NOTES, WORK_NOTES,
     TRAPS, optionVisible, computeResult): sha256 be90d8102ae42f96c88e482f0ef03c5534474eaf18c0e62924684b52ab14a75e
   - CALC block (parseMoney, parseYears, formatMoney, computeGap): sha256 862e98ecbce55ee8b53b9c1fbdc3e380fc7c51a507d094c6dcb6e26c3286a81a
   - askEngineLines (the Ask's size-answer composition): sha256 1ee67843083abb6fc6d461ec370517d4e0857a6ed17bcf739a212adf683685e9
   The MCP worker invents no math and no result logic of its own: the gap
   and the kind it returns are the site's own outputs. Do not hand-edit
   the blocks below; re-run the extractor against the site tree. */
"use strict";
/* === ENGINE START === */
var QUESTIONS = [
 {id:"q1", text:"Who is in your household right now?", hint:"Pick the closest fit.",
  options:[
   {t:"Just me", s:{r1:1, r2:1}},
   {t:"Me and a partner", s:{r1:1, r4:1}},
   {t:"Kids at home", s:{r1:2, r2:1}},
   {t:"Kids are grown. Parents may need help from me.", s:{r5:2, r4:1}}]},
 {id:"q2", text:"If your income stopped tomorrow, who would feel it?", hint:"Pick who would feel it most. Why we ask: coverage replaces their support.",
  options:[
   {t:"My kids depend on it", s:{r1:2, r4:1}},
   {t:"Mostly my partner", s:{r1:1, r4:1}},
   {t:"My partner earns. I run the home and the kids.", s:{r1:1}, flag:"caregiver"},
   {t:"No one depends on my income", s:{r5:1}}]},
 {id:"q3", text:"What would you want handled first?", hint:"Pick the one that sits heaviest.",
  options:[
   {t:"Paying off debts", s:{}},
   {t:"Keeping household income going", s:{r1:1}},
   {t:"The mortgage", s:{r1:1}},
   {t:"School costs for the kids", s:{r1:1}},
   {t:"Final costs and loose ends", s:{r5:1}}]},
 {id:"q4", text:"What life insurance coverage do you already have?", hint:"Count anything real, even small policies. Work cover often ends when the job ends.",
  options:[
   {t:"None", s:{}},
   {t:"Only through my job", s:{r3:5}},
   {t:"Through my job, plus a policy of my own", s:{r6:2}},
   {t:"A policy of my own", s:{r6:2}}]},
 {id:"q5", text:"How long does this protection need to last?", hint:"This is the question that shapes the answer most.",
  options:[
   {t:"Until the kids are grown", s:{r1:3, r2:2, r3:1}},
   {t:"For the next 20 to 30 years", s:{r1:3, r3:1}},
   {t:"For my whole life", s:{r5:3, r4:2}},
   {t:"Not sure yet", s:{r2:3, r4:1}}]},
 {id:"q6", text:"How do you think about the budget for this?", hint:"There is no wrong answer. It changes the match.",
  options:[
   {t:"Lowest cost that truly covers the need", s:{r1:2, r2:1}},
   {t:"A middle path", s:{r4:2, r2:1}},
   {t:"Build something long term", s:{r5:2, r4:2}}]},
 {id:"q7", text:"Might you ever put a lump sum into a policy?", hint:"Like a bonus, a CD payout, or an inheritance. Why we ask: lump sums can flip the tax rules.",
  options:[
   {t:"Yes, possibly", s:{}, trap:"mec"},
   {t:"No", s:{}},
   {t:"I already have money in a policy like that", s:{r6:1}, trap:"mec"}]},
 {id:"q8", text:"Does one of your policies have a loan? Or is one paid up?", hint:"Both are common. Both hide surprises. Why we ask: loans shrink what family receives.",
  options:[
   {t:"There is a loan on my policy", s:{r6:4}, trap:"loan"},
   {t:"I have a paid up policy", s:{r6:4}, trap:"paidup"},
   {t:"Neither", s:{}},
   {t:"I have no policy", s:{}}]},
 {id:"q9", text:"If money went to your family, how should it arrive?", hint:"Owners can often set this ahead of time.",
  options:[
   {t:"One lump sum", s:{r5:1}},
   {t:"Steady payments over time", s:{}, trap:"settle"},
   {t:"Not sure", s:{}, trap:"settle"}]},
 {id:"q10", text:"Want the choice to keep coverage for life? With no new health checks, later?", hint:"Health changes. Options bought young are cheap.",
  options:[
   {t:"Yes, that option matters to me", s:{r2:3}},
   {t:"No, a set term is fine", s:{r1:1}},
   {t:"I had not thought about it", s:{r2:1}}]},
 {id:"q11", text:"About how big is the coverage from your job?", hint:"Work plans list the size in your benefits papers.",
  options:[
   {t:"I do not know", s:{r3:1}},
   {t:"Less than one year of my pay", s:{r3:2}},
   {t:"One to two times my pay", s:{r3:1}},
   {t:"More than two times my pay", s:{}}]}
];
var RESULTS = {
 r1:{name:"Level term life insurance", looks:"Coverage for a set run of years. Often 20 or 30 years. It is the cheapest way to buy big coverage. It ends when the need ends."},
 r2:{name:"Convertible term life insurance", looks:"Term coverage now. A built-in switch lets you go life-long later. No new health checks are needed. Your health rating from today carries over. Watch the switch deadline."},
 r3:{name:"Your own policy alongside work coverage", looks:"A policy you own outright. It is sized to the real need. Work coverage is a bonus on top. It stays yours through job changes."},
 r4:{name:"A term and permanent blend", looks:"Term coverage holds the big needs, the ones with end dates. A small life-long piece holds the rest. Final costs and life-long care never expire."},
 r5:{name:"Permanent coverage built to last for life", looks:"Coverage built to never expire. It pays whenever death comes. Whole life works this way. So does guaranteed universal life. It costs more for that certainty."},
 r6:{name:"Start with a review of the policy you already have", looks:"Read the policy you own first. Check cash value, loans, and unpaid interest. Check funding pace and payout settings. The fix may sit inside it already."}
};
var WHY_SIT = {
 q1_0:["The plan just has to cover you. So it can stay small and simple.","No one counts on your pay right now. The coverage job stays small.","When it is just you, debts matter most. Final costs matter next."],
 q1_1:["A partner counts on shared income. The plan must hold for two.","Two lives run on one household budget. A death changes all the math.","Partners often insure each other. The survivor still owes every shared bill."],
 q1_2:["Kids at home means need at its peak. The budget is real too.","Young kids need the most years of support. A death hits hardest now.","Children count on you each day. Coverage has a clear job for years."],
 q1_3:["Kids are grown, and parents may need help. The need shifts to loose ends.","The big kid years are behind you. Final costs and loose ends lead now.","Size matters less at this stage. Certainty matters more."],
 q2_2:["Care work has real value, paycheck or not. Families would buy that help for years.","Home work gets priced at zero by pay math. The Check prices the work itself.","If the home parent died, help must be bought. Or work hours must be cut."]
};
var WHY_TYPE = {
 r1:["Level term gives the most coverage per dollar. It fits the years that matter most.","Term coverage matches a need with an end date. You stop paying when it stops.","The Check starts with level term here. The window is clear, and cost stays low."],
 r2:["Convertible term keeps a door open. Life-long coverage later needs no new health checks.","It costs a bit more than plain term. What it buys is choice later.","Much can change in twenty years. Health is one of those things. Flexibility guards against that."],
 r3:["Work coverage ends when the job ends. A policy you own stays yours.","Your own policy is priced on health today. It survives layoffs and job changes.","Your own policy is sized to the full need. Work coverage is just a cushion."],
 r4:["Term does the big, short jobs cheaply. Permanent does the lasting jobs.","Most needs expire. A few never do. One kind rarely fits both well.","Your horizon points two ways at once. A blend is the shape that fits here."],
 r5:["Permanent coverage is there at death, whenever it comes. A life-long need calls for that.","The goal is money that outlives you. Expiring coverage is the wrong tool here.","Families here accept a higher cost. They pay it for certainty."],
 r6:["Facts come first in a review. Loans, funding pace, and payout settings all count.","New coverage talk is too soon. The policy in hand is not understood yet.","A careful review often finds the answer inside. Loans or payout settings may hold it."]
};
var WHY_HORIZON = {
 q5_0:"That matches your horizon: the kid years.",
 q5_1:"That matches your horizon: a set stretch of years.",
 q5_2:"That matches your horizon: coverage for life.",
 q5_3:"Your horizon is not settled yet. Keeping options open matters most."
};
var SIZE_NOTES = {
 q3_0:"How the size is set: DIME. Debts come first, as you flagged. Add income for the need years. Add any mortgage and school costs. Take off savings and coverage you have. The gap is the working size.",
 q3_1:"How the size is set: DIME. Income years come first, as you flagged. Add debts, any mortgage, and any school costs. Take off savings and coverage you have. The gap is the working size.",
 q3_2:"How the size is set: DIME. The mortgage anchors it, as you flagged. Add debts and income years. Add any school costs too. Take off savings and coverage you have. The gap is the working size.",
 q3_3:"How the size is set: DIME. School costs count per child, as you flagged. Add debts, income years, and any mortgage. Take off savings and coverage you have. The gap is the working size.",
 q3_4:"How the size is set: DIME. Final costs are the smallest part. The Check still counts them fully. Add debts, income years, any mortgage, and any school costs. Take off savings and coverage you have. The gap is the working size."
};
var WORK_NOTES = {
 q11_0:"You do not know your work coverage size. Ask your job for the figure. Write the figure down. Count it as zero until you know it. No size can be set without it.",
 q11_1:"Your work coverage is less than one year of pay. It helps, but it is small. Your own coverage is sized to the full need. Work coverage then counts as a bonus on top.",
 q11_2:"Your work coverage is one to two times pay. That is the range most work plans give. It counts toward your need. It ends when the job ends. The gap is the need minus this size.",
 q11_3:"Your work coverage is more than two times pay. That is large for a work plan. It counts toward your need. It still ends when the job ends. Ask if you can keep it after you leave."
};
var TRAPS = {
 mec:{title:"Worth knowing: funding too fast", text:"Pay into a cash value policy too fast, and the tax rules change (insurers call the result a MEC). Money you pull out is taxed first. A penalty can hit before 59 and a half. One lump sum paid in always triggers it. Fine for death coverage alone, though."},
 loan:{title:"Worth knowing: the loan balance", text:"At death, family gets the policy's full amount. Any loan and unpaid interest come off first. Cash value is not added on top. If loans outgrow the policy, the policy can end. A tax bill can follow when it ends."},
 paidup:{title:"Worth knowing: paid up is not matured", text:"Paid up means premiums are done. Maturity comes at death or a set age. Most new policies set that age at 121. An old policy near 100 needs a plan. Its payout is taxed on the gain."},
 settle:{title:"Worth knowing: how the money arrives", text:"One lump sum can be spent in a year. Monthly payments last. The option called straight life pays the most per month. It stops fully when the person receiving it dies. Other options promise a set period or a set amount."},
 group:{title:"Worth knowing: the $50,000 line at work", text:"Work coverage is tax free only to $50,000. Past that, the IRS's table cost of that part counts as income. Group coverage ends or shrinks with the job."},
 caregiver:{title:"Worth knowing: the unpaid job counts", text:"Needs math prices a home parent's work. It counts years of childcare and home help. The family would have to buy that help. Income math misses this fully."}
};
function optionVisible(qi, oi, ans){
  // State from q4 (index 3): 0 = no coverage, 1 = job only, 2 = job + own policy, 3 = own policy.
  // A later option that assumes an individually owned policy, or denies having one,
  // is only shown when it does not contradict the q4 answer.
  var cov = ans[3];
  if (cov !== undefined){
    if (qi === 6 && oi === 2) return cov === 2 || cov === 3;   // q7: "I already have money in a policy like that"
    if (qi === 7){
      if (oi === 3) return cov === 0;                          // q8: "I have no policy"
      if (oi === 0 || oi === 1) return cov === 2 || cov === 3; // q8: loan on my policy / paid up policy
    }
  }
  // Household discipline (Oct 31, 2026, option-fit lane): an option that
  // names kids or a partner is shown only when the household answer (q1,
  // index 0) established them. 0 = just me, 1 = me and a partner,
  // 2 = kids at home, 3 = kids grown, parents may need help.
  var hh = ans[0];
  if (hh !== undefined){
    if (qi === 4 && oi === 0) return hh === 2;  // q5: "Until the kids are grown" — only when kids are at home
    if (qi === 1){
      if (oi === 0) return hh === 2;            // q2: "My kids depend on it" — kids path only
      if (oi === 1) return hh === 1;            // q2: "Mostly my partner" — partner declared
      if (oi === 2) return hh === 2;            // q2: caregiver — the pick itself asserts the partner, on the kids path it serves
    }
  }
  return true;
}
function computeResult(ans){
  var score = {r1:0, r2:0, r3:0, r4:0, r5:0, r6:0};
  var traps = [];
  var i, q, o, k;
  for (i = 0; i < QUESTIONS.length; i++){
    if (ans[i] === undefined) continue;
    if (i === 10 && !(ans[3] === 1 && ans[4] !== 2)) continue; // q11 scores count only for work-only coverage with a term horizon: the whole-life pick outranks work size, and the size note serves both work slices regardless
    q = QUESTIONS[i]; o = q.options[ans[i]];
    for (k in o.s) score[k] += o.s[k];
    if (o.trap && traps.indexOf(o.trap) === -1) traps.push(o.trap);
    if (o.flag === "caregiver" && traps.indexOf("caregiver") === -1) traps.push("caregiver");
  }
  if (ans[3] === 1 && traps.indexOf("group") === -1) traps.push("group");
  if (ans[5] === 0){
    var override = (ans[4] === 2 && ans[0] === 3);
    if (!override) score.r5 = Math.min(score.r5, Math.max(score.r1, score.r2) - 1);
  }
  var order = ["r6","r3","r2","r1","r4","r5"];
  var best = "r1", bestScore = -1;
  for (i = 0; i < order.length; i++){
    var id = order[i];
    if (score[id] > bestScore){ bestScore = score[id]; best = id; }
  }
  if (ans[4] === 2 && (best === "r1" || best === "r3")){
    // Whole-life gate (SPEC-CL-DIM9-HORIZON-1): a need that lasts for
    // life cannot be met by a kind that ends, or by the work kind.
    // Re-pick from the kinds that can last: review, convertible,
    // blend, permanent. Same tie order as above. Scores stay as cast.
    var allowed = ["r6","r2","r4","r5"];
    bestScore = -1;
    for (i = 0; i < allowed.length; i++){
      var aid = allowed[i];
      if (score[aid] > bestScore){ bestScore = score[aid]; best = aid; }
    }
  }
  var sitKey = "q1_" + ans[0];
  var sitPool = WHY_SIT[sitKey];
  if (!sitPool){
    if (ans[1] === 2) sitPool = WHY_SIT.q2_2;
    else sitPool = WHY_SIT.q1_2;
  }
  var pick = function(pool, seed){ return pool[Math.abs(seed) % pool.length]; };
  var seed = ans[0]*7 + ans[4]*3 + ans[5];
  var why = pick(sitPool, seed) + " " + pick(WHY_TYPE[best], seed + (ans[1] === undefined ? 0 : ans[1])) + " " + WHY_HORIZON["q5_" + ans[4]];
  var workNote = (ans[10] !== undefined && (ans[3] === 1 || ans[3] === 2)) ? WORK_NOTES["q11_" + ans[10]] : null;
  return { result: best, score: score, traps: traps, why: why, sizeNote: ans[2] === undefined ? null : SIZE_NOTES["q3_" + ans[2]], workNote: workNote };
}
/* === ENGINE END === */
/* === CALC START === */
function parseMoney(v){
  if (v === null || v === undefined) return 0;
  if (typeof v === "number"){ if (!isFinite(v)) return NaN; return Math.round(v); }
  var t = String(v).replace(/[$,\s]/g, "");
  if (t === "") return 0;
  if (!/^\d+(\.\d+)?$/.test(t)) return NaN;
  return Math.round(parseFloat(t));
}
function parseYears(v, def){
  if (v === null || v === undefined) return def;
  if (typeof v === "number"){ if (!isFinite(v) || v % 1 !== 0 || v < 0) return NaN; return Math.min(60, v); }
  var t = String(v).replace(/\s/g, "");
  if (t === "") return def;
  if (!/^\d+$/.test(t)) return NaN;
  return Math.min(60, parseInt(t, 10));
}
function formatMoney(n){
  var t = String(Math.round(n));
  return "$" + t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function computeGap(input){
  input = input || {};
  function pick(){
    for (var i = 0; i < arguments.length; i++){
      if (input[arguments[i]] !== undefined) return input[arguments[i]];
    }
    return undefined;
  }
  var income = parseMoney(pick("income", "pay", "ownIncome", "calcIncome"));
  var spouseIncome = parseMoney(pick("spouseIncome", "partnerIncome", "spouse", "partner", "calcSpouseIncome"));
  var mortgage = parseMoney(pick("mortgage", "calcMortgage"));
  var debts = parseMoney(pick("debts", "debt", "calcDebts"));
  var school = parseMoney(pick("school", "education", "calcSchool"));
  var savings = parseMoney(pick("savings", "calcSavings"));
  var existing = parseMoney(pick("existing", "existingCoverage", "coverage", "calcExisting"));
  var years = parseYears(pick("years", "ownYears", "calcYears"), 10);
  var spouseYearsRaw = pick("spouseYears", "partnerYears", "calcSpouseYears");
  var spouseYears = (spouseYearsRaw === undefined || spouseYearsRaw === null || String(spouseYearsRaw).replace(/\s/g, "") === "")
    ? years : parseYears(spouseYearsRaw, years);
  var moneyVals = [income, spouseIncome, mortgage, debts, school, savings, existing];
  for (var m = 0; m < moneyVals.length; m++){ if (typeof moneyVals[m] !== "number" || isNaN(moneyVals[m])) return {valid: false, invalid: true}; }
  if (typeof years !== "number" || isNaN(years) || typeof spouseYears !== "number" || isNaN(spouseYears)) return {valid: false, invalid: true};
  var incomeTotal = income * years;
  var spouseTotal = spouseIncome * spouseYears;
  var need = debts + incomeTotal + spouseTotal + mortgage + school;
  var gap = Math.max(0, need - savings - existing);
  return {
    valid: true, invalid: false,
    debts: debts,
    income: income, years: years, incomeTotal: incomeTotal,
    spouseIncome: spouseIncome, spouseYears: spouseYears, spouseTotal: spouseTotal,
    partnerIncome: spouseIncome, partnerYears: spouseYears, partnerTotal: spouseTotal,
    mortgage: mortgage, school: school,
    need: need, totalNeed: need, total: need,
    savings: savings, existing: existing,
    gap: gap, isZero: gap === 0, zero: gap === 0
  };
}
/* === CALC END === */
function askEngineLines(raw, lang){
  const out = computeGap(raw);
  if (!out.valid) return null;
  const es = lang === "es";
  const M = formatMoney;
  const blank = k => String(raw[k] === undefined ? "" : raw[k]).trim() === "";
  const lines = [];
  const notes = [];
  const noPay = out.income === 0 && out.spouseIncome === 0;
  if (noPay){
    notes.push(es ? "Sin sueldo en este cálculo." : "No pay in this run.");
    notes.push(es ? "Este cálculo no tiene sueldo que reemplazar. La brecha salta la parte más grande." : "This run has no pay to replace. So the gap skips the biggest part.");
    notes.push(es ? "Las deudas y la hipoteca aún cuentan. Los costos finales no están en este cálculo." : "Debts and the mortgage still count. Final costs are not in this math.");
  } else if (out.gap === 0){
    notes.push(es ? "La cobertura que tienes cubre la necesidad que escribiste. Solo con estos números." : "The coverage you have covers the need you typed. That is on these numbers only.");
  }
  lines.push((es ? "Deudas por pagar: " : "Debts to pay off: ") + M(out.debts));
  if (blank("debts")) lines.push(es ? "No mencionaste otras deudas, así que contamos $0. Agrégalas si debes algo." : "You didn't mention other debts, so we counted $0. Add them if you owe any.");
  lines.push(out.income === 0 ? (es ? "Tu sueldo: $0" : "Your pay: $0") : (es ? "Tu sueldo: " : "Your pay: ") + M(out.income) + (es ? " al año, por " : " a year, for ") + out.years + (out.years === 1 ? (es ? " año" : " year") : (es ? " años" : " years")) + " = " + M(out.incomeTotal));
  if (blank("income")) lines.push(es ? "No mencionaste tu sueldo, así que contamos $0. Agrégalo si tienes sueldo ahora." : "You didn't mention your pay, so we counted $0. Add it if you have pay now.");
  if (blank("years")) lines.push(es ? "No mencionaste los años, así que usamos 10 años." : "You didn't mention years, so we used 10 years.");
  lines.push(out.spouseIncome === 0 ? (es ? "Sueldo de tu pareja: $0" : "Partner pay: $0") : (es ? "Sueldo de tu pareja: " : "Partner pay: ") + M(out.spouseIncome) + (es ? " al año, por " : " a year, for ") + out.spouseYears + (out.spouseYears === 1 ? (es ? " año" : " year") : (es ? " años" : " years")) + " = " + M(out.spouseTotal));
  if (blank("spouseIncome")) lines.push(es ? "No mencionaste el sueldo de tu pareja, así que contamos $0. Escribe 0 si no hay." : "You didn't mention partner pay, so we counted $0. Type 0 if there is none.");
  lines.push((es ? "Hipoteca que aún debes: " : "Mortgage still owed: ") + M(out.mortgage));
  if (blank("mortgage")) lines.push(es ? "No mencionaste la hipoteca, así que contamos $0. Agrégala si aún debes una." : "You didn't mention the mortgage, so we counted $0. Add it if you still owe one.");
  lines.push((es ? "Costos de escuela por venir: " : "School costs ahead: ") + M(out.school));
  if (blank("school")) lines.push(es ? "No mencionaste los costos de escuela, así que contamos $0. Agrégalos si piensas pagarlos." : "You didn't mention school costs, so we counted $0. Add them if you plan to pay. A rough guess is fine here.");
  lines.push((es ? "Necesidad total: " : "Total need: ") + M(out.need));
  lines.push((es ? "Menos ahorros: " : "Minus savings: ") + M(out.savings));
  if (blank("savings")) lines.push(es ? "No mencionaste los ahorros, así que contamos $0. Agrega el dinero que podrías usar." : "You didn't mention savings, so we counted $0. Add any cash you could use.");
  lines.push((es ? "Menos la cobertura que tienes: " : "Minus coverage you have: ") + M(out.existing));
  if (blank("existing")) lines.push(es ? "No mencionaste la cobertura que tienes, así que contamos $0. Agrégala si tienes alguna." : "You didn't mention coverage you have, so we counted $0. Add it if you have some.");
  lines.push((es ? "Tu brecha: " : "Your gap: ") + M(out.gap));
  const anyBlank = ["income","spouseIncome","mortgage","debts","school","savings","existing","years"].some(blank);
  if (anyBlank) notes.push(es ? "No mencionaste algunas cosas. Esta brecha cuenta solo lo que escribiste. La brecha real puede ser más grande." : "Some things weren't mentioned. This gap counts only what you typed. The true gap can be bigger.");
  return {figure: M(out.gap), lines: lines, notes: notes};
}

export { QUESTIONS, RESULTS, WHY_SIT, WHY_TYPE, WHY_HORIZON, SIZE_NOTES, WORK_NOTES, TRAPS, optionVisible, computeResult, parseMoney, parseYears, formatMoney, computeGap, askEngineLines };
