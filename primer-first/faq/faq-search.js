/**
 * Extra search keys for non-native spellings. Hand list first (Discord,
 * especially access and pay), then cheap variants of the important terms.
 */

const HAND = {
  // Access / platforms
  lablebox: "labelbox",
  labebox: "labelbox",
  lablebx: "labelbox",
  labeboxx: "labelbox",
  lableebox: "labelbox",
  labelbx: "labelbox",
  labelboc: "labelbox",
  lebelbox: "labelbox",
  labalbox: "labelbox",
  labbelbox: "labelbox",
  labolbox: "labelbox",
  lableboxx: "labelbox",
  lable: "label",
  labling: "labeling",
  labelling: "labeling",
  labbeling: "labeling",
  labeleing: "labeling",
  labelled: "labeled",
  labeller: "labeler",
  labler: "labeler",
  lableer: "labeler",
  tasker: "labeler",
  hubstaf: "hubstaff",
  hubstuff: "hubstaff",
  hubsta: "hubstaff",
  hubstafff: "hubstaff",
  hubstaffs: "hubstaff",
  hupstaff: "hubstaff",
  hoobstaff: "hubstaff",
  habstaff: "hubstaff",
  hubstff: "hubstaff",
  hubstaaff: "hubstaff",
  hubstafh: "hubstaff",
  "hub-staff": "hubstaff",
  hubstaffapp: "hubstaff",
  vercell: "vercel",
  versel: "vercel",
  verssel: "vercel",
  versal: "vercel",
  vercal: "vercel",
  vrecel: "vercel",
  vercle: "vercel",
  varcel: "vercel",
  verscel: "vercel",
  versselapp: "vercel",
  workfoce: "workforce",
  workforse: "workforce",
  workfroce: "workforce",
  workforc: "workforce",
  workfornce: "workforce",
  wokforce: "workforce",
  workfource: "workforce",
  workeforce: "workforce",
  workfoorce: "workforce",
  workforcce: "workforce",
  workspacee: "workspace",
  workpace: "workspace",
  workspase: "workspace",
  wokspace: "workspace",
  workespace: "workspace",
  aligner: "alignerr",
  alligner: "alignerr",
  allignerr: "alignerr",
  alliner: "alignerr",
  aliner: "alignerr",
  alignerrr: "alignerr",
  aligenrr: "alignerr",
  aligenerr: "alignerr",
  alighner: "alignerr",
  alighnerr: "alignerr",
  alignerrd: "alignerr",
  passwrd: "password",
  pasword: "password",
  passord: "password",
  passward: "password",
  passwort: "password",
  paswoord: "password",
  passowrd: "password",
  passwod: "password",
  passwor: "password",
  passwrod: "password",
  emial: "email",
  emaill: "email",
  emai: "email",
  emil: "email",
  adress: "address",
  addres: "address",
  addresse: "address",
  loggin: "login",
  loging: "login",
  logn: "login",
  signin: "login",
  loged: "logged",
  logeed: "logged",
  acess: "access",
  acccess: "access",
  acces: "access",
  ascess: "access",
  acesss: "access",
  accses: "access",
  axxess: "access",
  denid: "denied",
  denided: "denied",
  denyd: "denied",
  incognitto: "incognito",
  incognit: "incognito",
  incognite: "incognito",
  inkognito: "incognito",
  incognittoo: "incognito",
  chromee: "chrome",
  crome: "chrome",
  chrom: "chrome",
  browesr: "browser",
  brower: "browser",
  broswer: "browser",
  browsr: "browser",
  protall: "portal",
  portel: "portal",
  portol: "portal",
  portaal: "portal",
  protal: "portal",
  cliant: "client",
  cient: "client",
  cliend: "client",
  clinet: "client",
  clientportal: "portal",
  credencials: "credentials",
  credentals: "credentials",
  credetials: "credentials",
  credentails: "credentials",
  creds: "credentials",
  invit: "invite",
  invitte: "invite",
  invatation: "invitation",
  invitacion: "invitation",
  invetation: "invitation",
  quizz: "quiz",
  quize: "quiz",
  quis: "quiz",
  retacke: "retake",
  reatake: "retake",
  lockd: "locked",
  loced: "locked",
  lockout: "locked",
  suport: "support",
  suppport: "support",
  sapport: "support",
  supprt: "support",
  taigaa: "taiga",
  tagia: "taiga",
  worldsim: "worldsim",
  wordsim: "worldsim",
  hrfl: "hfrl",
  pairwize: "pairwise",
  pairwaise: "pairwise",
  pairwis: "pairwise",
  perwise: "pairwise",
  pairwse: "pairwise",

  // Pay / time / submit — include vowel-drop forms like pyment / pymnt
  pyment: "payment",
  pymnt: "payment",
  pymnet: "payment",
  pyamnt: "payment",
  pyament: "payment",
  peyment: "payment",
  piyment: "payment",
  paymint: "payment",
  paymont: "payment",
  paymunt: "payment",
  paymant: "payment",
  paymnt: "payment",
  paymet: "payment",
  paymnet: "payment",
  payement: "payment",
  payeement: "payment",
  paymeent: "payment",
  paymment: "payment",
  pament: "payment",
  paiment: "payment",
  paiement: "payment",
  paynment: "payment",
  paymen: "payment",
  paymetn: "payment",
  paimnt: "payment",
  pymnts: "payments",
  paymnts: "payments",
  paymants: "payments",
  payements: "payments",
  peyments: "payments",
  paymints: "payments",
  payed: "paid",
  paied: "paid",
  payd: "paid",
  pyd: "paid",
  payday: "paid",
  payout: "payment",
  "pay-out": "payment",
  paycheck: "payment",
  paycheque: "payment",
  "pay-check": "payment",
  paychek: "payment",
  paychec: "payment",
  money: "payment",
  mony: "payment",
  monie: "payment",
  compensation: "payment",
  compensaton: "payment",
  compesation: "payment",
  compenstation: "payment",
  remuneracion: "payment",
  remuneration: "payment",
  invoice: "payment",
  invoce: "payment",
  billing: "payment",
  blling: "payment",
  billed: "payment",
  unpaid: "payment",
  underpaid: "payment",
  overpaid: "payment",
  stipend: "payment",
  transaction: "payment",
  transacion: "payment",
  disbursement: "payment",
  disburse: "payment",
  sallery: "pay",
  salary: "pay",
  sallary: "pay",
  salery: "pay",
  wage: "pay",
  wages: "pay",
  honorarium: "payment",
  remunerate: "payment",
  doller: "dollar",
  dollers: "dollar",
  dolar: "dollar",
  fridayy: "friday",
  fridday: "friday",
  fryday: "friday",
  fridy: "friday",
  weekely: "weekly",
  weakly: "weekly",
  wekly: "weekly",
  cicle: "cycle",
  cykle: "cycle",
  recieve: "receive",
  recieved: "received",
  recive: "receive",
  recived: "received",
  receve: "receive",
  receved: "received",
  pendng: "pending",
  pendding: "pending",
  pendig: "pending",
  aproved: "approved",
  aproove: "approve",
  approove: "approve",
  aprooval: "approval",
  rewiew: "review",
  reveiw: "review",
  reivew: "review",
  revview: "review",
  reviw: "review",
  reviewe: "reviewer",
  reviewr: "reviewer",
  faild: "failed",
  faill: "fail",
  faile: "fail",
  fali: "fail",
  unsucessful: "failed",
  rejected: "failed",
  rejection: "fail",
  submision: "submission",
  submition: "submission",
  submisson: "submission",
  submisionn: "submission",
  submittion: "submission",
  submited: "submitted",
  submittd: "submitted",
  sumitted: "submitted",
  sumbitted: "submitted",
  sumbit: "submit",
  submitt: "submit",
  submmit: "submit",
  gform: "form",
  goolgeform: "form",
  googleform: "form",
  googledoc: "form",
  googledocs: "form",
  stageid: "uuid",
  taskid: "id",
  identifer: "id",
  screensht: "screenshot",
  screenhot: "screenshot",
  screenshoot: "screenshot",
  scrrenshot: "screenshot",
  relase: "release",
  releas: "release",
  relese: "release",
  rellease: "release",
  skipp: "skip",
  expier: "expire",
  expirs: "expire",
  bufer: "buffer",
  bufffer: "buffer",
  timmer: "timer",
  tiemr: "timer",
  midnite: "midnight",
  midnigt: "midnight",
  midnigh: "midnight",
  dashbord: "dashboard",
  dashbaord: "dashboard",
  dasboard: "dashboard",
  reework: "rework",
  reworck: "rework",
  attemp: "attempt",
  atempt: "attempt",
  attemt: "attempt",
  attmept: "attempt",

  // Labeling
  honsety: "honesty",
  honnesty: "honesty",
  honestity: "honesty",
  honety: "honesty",
  honasty: "honesty",
  honestey: "honesty",
  deferance: "deference",
  deferrence: "deference",
  deferense: "deference",
  defference: "deference",
  severety: "severity",
  sevirity: "severity",
  severaty: "severity",
  sevarity: "severity",
  accurat: "accurate",
  accuarcy: "accuracy",
  accurecy: "accuracy",
  accurete: "accurate",
  acurate: "accurate",
  behaviral: "behavioral",
  behavour: "behavior",
  behaviour: "behavior",
  behaviours: "behaviors",
  behavoural: "behavioral",
  claraty: "clarity",
  clarrity: "clarity",
  clartiy: "clarity",
  scopying: "scoping",
  scopping: "scoping",
  scopingg: "scoping",
  intereaction: "interaction",
  interacion: "interaction",
  interacton: "interaction",
  confidance: "confidence",
  confidnce: "confidence",
  confidense: "confidence",
  saftey: "safety",
  safty: "safety",
  seperate: "separate",
  occurrance: "occurrence",
  occurence: "occurrence",
  ocurrence: "occurrence",
  transcipt: "transcript",
  transript: "transcript",
  transcirpt: "transcript",
  transcrip: "transcript",
  rolllout: "rollout",
  rolout: "rollout",
  axises: "axes",
  axies: "axes",
  flagg: "flag",
  flaged: "flagged",
  flagd: "flagged",

  // Carried over from the previous search.ts alias table (not in Grok's list)
  alignner: "alignerr",
  sumbission: "submission",
  sumbmit: "submit",
  failled: "failed",
  acount: "account",
  accont: "account",
  passwd: "password",
  pssword: "password",
  qiuz: "quiz",
  cource: "course",
  corse: "course",
  monny: "payment",
  revew: "review",
  feedbak: "feedback",
  feedack: "feedback",
  profil: "profile",
  gogle: "google",
  googel: "google",
  denyed: "denied",
  denide: "denied",
  lokced: "locked",
  loked: "locked",
  realease: "release",
  houres: "hours",
  peding: "pending",
  stauts: "status",
  staus: "status",
  clint: "client",
  taks: "task",
  tsk: "task",
  emal: "email",
  // Frequent non-English words for money/login topics.
  pago: "payment",
  pagamento: "payment",
  dinero: "payment",
  senha: "password",
  cliente: "client",
};

/** Domain words we expand into extra letter-swap / drop / double forms. */
const SEEDS = [
  "labelbox",
  "labeling",
  "labeler",
  "hubstaff",
  "vercel",
  "workforce",
  "workspace",
  "alignerr",
  "password",
  "email",
  "login",
  "access",
  "denied",
  "incognito",
  "chrome",
  "browser",
  "portal",
  "client",
  "credentials",
  "invite",
  "invitation",
  "quiz",
  "locked",
  "support",
  "pairwise",
  "payment",
  "payments",
  "paid",
  "paycheck",
  "payout",
  "compensation",
  "invoice",
  "billing",
  "unpaid",
  "friday",
  "weekly",
  "cycle",
  "receive",
  "received",
  "pending",
  "approved",
  "review",
  "reviewer",
  "failed",
  "fail",
  "submission",
  "submitted",
  "submit",
  "form",
  "uuid",
  "screenshot",
  "release",
  "skip",
  "expire",
  "timer",
  "midnight",
  "dashboard",
  "rework",
  "attempt",
  "honesty",
  "deference",
  "severity",
  "accurate",
  "accuracy",
  "behavioral",
  "behavior",
  "clarity",
  "scoping",
  "interaction",
  "confidence",
  "safety",
  "transcript",
  "rollout",
];

const SEED_SET = new Set(SEEDS);

/** Do not steal common English words or other domain terms. */
const PROTECTED = new Set([
  "from",
  "for",
  "or",
  "on",
  "in",
  "the",
  "and",
  "are",
  "was",
  "not",
  "can",
  "get",
  "got",
  "see",
  "set",
  "use",
  "one",
  "two",
  "day",
  "now",
  "how",
  "why",
  "who",
  "out",
  "off",
  "all",
  "any",
  "new",
  "old",
  "too",
  "also",
  "just",
  "than",
  "then",
  "that",
  "this",
  "with",
  "have",
  "has",
  "had",
  "does",
  "did",
  "will",
  "into",
  "over",
  "only",
  "more",
  "most",
  "some",
  "such",
  "same",
  "each",
  "both",
  "next",
  "last",
  "long",
  "time",
  "work",
  "task",
  "page",
  "open",
  "show",
  "link",
  "mail",
  "hour",
  "week",
  "rate",
  "pass",
  "fail",
  "paid",
  "skip",
  "form",
  "quiz",
  "axis",
  "flag",
]);

function add(map, from, to) {
  if (!from || from === to || from.length < 3) return;
  if (map[from] || SEED_SET.has(from) || PROTECTED.has(from)) return;
  map[from] = to;
}

/** Extra vowel-drop / vowel-swap forms. Catches pyment, pymnt, peyment. */
function vowelVariants(word) {
  const vowels = new Set("aeiou");
  const out = new Set();
  const push = (value) => {
    if (value && value !== word && value.length >= 4) out.add(value);
  };

  push(word.replace(/[aeiou]/g, ""));
  for (let i = 0; i < word.length; i++) {
    if (vowels.has(word[i])) push(word.slice(0, i) + word.slice(i + 1));
  }
  const pairs = [
    ["a", "e"],
    ["e", "a"],
    ["a", "i"],
    ["e", "i"],
    ["i", "e"],
    ["a", "y"],
    ["e", "y"],
    ["ay", "ai"],
    ["ai", "ay"],
    ["ay", "ey"],
    ["ey", "ay"],
    ["ent", "int"],
    ["ent", "ant"],
    ["ent", "ont"],
    ["ment", "mnt"],
    ["pay", "py"],
    ["pay", "pey"],
    ["pay", "pai"],
  ];
  for (const [from, to] of pairs) {
    if (word.includes(from)) push(word.replace(from, to));
  }
  return [...out];
}

function expand(word) {
  const out = new Set();
  const push = (value) => {
    if (value && value !== word && value.length >= 3) out.add(value);
  };

  for (let i = 0; i < word.length; i++) {
    push(word.slice(0, i) + word.slice(i + 1));
  }
  for (let i = 0; i < word.length - 1; i++) {
    push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  }
  for (let i = 0; i < word.length; i++) {
    push(word.slice(0, i) + word[i] + word.slice(i));
  }

  const swaps = [
    [/ph/g, "f"],
    [/ie/g, "ei"],
    [/ei/g, "ie"],
    [/ance$/g, "ence"],
    [/ence$/g, "ance"],
    [/er$/g, "or"],
    [/or$/g, "er"],
    [/tion$/g, "sion"],
    [/sion$/g, "tion"],
    [/ise$/g, "ize"],
    [/ize$/g, "ise"],
    [/our/g, "or"],
    [/ll/g, "l"],
    [/tt/g, "t"],
    [/ss/g, "s"],
    [/ee/g, "i"],
    [/y$/g, "i"],
    [/y$/g, "ey"],
    [/ou/g, "o"],
  ];
  for (const [pattern, replacement] of swaps) {
    push(word.replace(pattern, replacement));
  }

  return [...out];
}

function buildAliases() {
  const map = { ...HAND };
  for (const seed of ["payment", "payments", "paycheck", "payout", "compensation", "invoice", "billing"]) {
    const target = seed === "payments" ? "payments" : "payment";
    for (const variant of [...expand(seed), ...vowelVariants(seed)]) add(map, variant, target);
  }
  for (const seed of SEEDS) {
    if (seed.length < 6) continue;
    for (const variant of expand(seed)) add(map, variant, seed);
  }
  return map;
}

const ALIASES = buildAliases();


function faqGroups() {
  return globalThis.FAQ_GROUPS || [];
}
function groupLabel(id) {
  const row = faqGroups().find((item) => item.id === id);
  return row ? row.label : "";
}

/** Filler words dropped from queries. Long broken-English questions become 2–3 content words. */
const STOP = new Set([
  "the", "to", "do", "is", "in", "on", "a", "an", "of", "for", "and", "or", "my",
  "me", "i", "it", "at", "be", "we", "why", "how", "what", "when", "where",
  "which", "who", "can", "cant", "cannot", "dont", "didnt", "doesnt", "isnt",
  "wont", "im", "am", "are", "was", "were", "will", "would", "should", "could",
  "have", "has", "had", "get", "got", "but", "that", "this", "these", "there",
  "so", "if", "with", "from", "you", "your", "please", "pls", "plz", "hi",
  "hello", "hey", "help", "any", "anyone", "someone", "some", "still", "just",
  "also", "about", "need", "want", "know", "guys", "team", "then", "than", "its",
]);

function fold(value){
  return value
    .toLowerCase()
    .replaceAll("behaviour", "behavior")
    .replaceAll("labelling", "labeling")
    .replaceAll("labelled", "labeled")
    .replaceAll("hub staff", "hubstaff")
    .replaceAll("hub stuff", "hubstaff")
    .replaceAll("label box", "labelbox")
    .replaceAll("work force", "workforce")
    .replaceAll("work space", "workspace")
    .replaceAll("sign in", "login")
    .replaceAll("log in", "login")
    .replaceAll("google form", "form")
    .replaceAll("pay ment", "payment")
    .replaceAll("payed", "paid")
    .replaceAll("got paid", "paid")
    .replaceAll("get paid", "paid")
    .replaceAll("g form", "form")
    .replaceAll("stage uuid", "uuid")
    .replaceAll("task id", "id")
    .replaceAll("access denied", "denied")
    .replaceAll("alignerrworkforce", "alignerr workforce")
    .replaceAll("alignerrworkspace", "alignerr workspace");
}

function tokenize(value) {
  // Drop inline link URLs ("[label](url)" → "[label]") so URL fragments do not
  // pollute the search index; the label text stays searchable.
  const folded = fold(value.replace(/\]\([^)]*\)/g, "]"));
  const raw = folded
    .replace(/\$/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return raw.map((token) => ALIASES[token] ?? token);
}

/** Damerau–Levenshtein: insert, delete, swap, adjacent transpose. */
function distance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 99;

  const d = [];
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
    for (let j = 1; j <= b.length; j++) d[i][j] = i === 0 ? j : 0;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

function allowedDistance(token) {
  if (token.length <= 3) return 0;
  if (token.length <= 5) return 1;
  return 2;
}

function tokenHits(query, hay) {
  if (hay.includes(query)) return true;
  if (query.length >= 3 && hay.some((word) => word.startsWith(query) || (query.startsWith(word) && word.length >= 3))) {
    return true;
  }
  const max = allowedDistance(query);
  if (max === 0) return false;
  return hay.some((word) => Math.abs(word.length - query.length) <= max && distance(query, word) <= max);
}



/**
 * Rank items against the query. Items matching every content word come first
 * and exclusively; when no item matches every word (typical for long
 * broken-English questions), fall back to the closest partial matches instead
 * of showing nothing.
 */
function searchFaqDetailed(items, rawQuery) {
  const queryTokens = tokenize(rawQuery).filter(
    (token) => !STOP.has(token) && (token.length > 1 || /^\d/.test(token) || token === "q"),
  );
  if (!queryTokens.length) return { items, partial: false };

  const rows = [];

  for (const item of items) {
    const titleTokens = tokenize(item.q);
    const keyTokens = tokenize(item.k ?? "");
    const bodyTokens = tokenize(`${item.a} ${groupLabel(item.group)} ${item.group}`);
    let matched = 0;
    let titleHits = 0;
    let keyHits = 0;

    for (const token of queryTokens) {
      const inTitle = tokenHits(token, titleTokens);
      const inKey = !inTitle && tokenHits(token, keyTokens);
      if (inTitle || inKey || tokenHits(token, bodyTokens)) {
        matched += 1;
        if (inTitle) titleHits += 1;
        if (inKey) keyHits += 1;
      }
    }
    if (!matched) continue;
    const full = matched === queryTokens.length ? 100 : 0;
    rows.push({
      item,
      matched,
      score: full + matched * 10 + titleHits * 5 + keyHits * 3 + (item.q.length < 80 ? 1 : 0),
    });
  }

  if (!rows.length) return { items: [], partial: false };

  const best = Math.max(...rows.map((row) => row.matched));
  const anyFull = best === queryTokens.length;
  const kept = rows.filter((row) =>
    anyFull ? row.matched === queryTokens.length : row.matched >= Math.max(1, best - 1),
  );
  kept.sort((a, b) => b.score - a.score || a.item.q.localeCompare(b.item.q));
  const capped = anyFull ? kept : kept.slice(0, 8);
  return { items: capped.map((row) => row.item), partial: !anyFull };
}

function searchFaq(items, rawQuery) {
  return searchFaqDetailed(items, rawQuery).items;
}


globalThis.FAQ_ALIASES = ALIASES;
globalThis.searchFaq = searchFaq;
globalThis.searchFaqDetailed = searchFaqDetailed;
globalThis.tokenize = tokenize;
globalThis.distance = distance;
