import { generateUsernames } from "./ad";
import { generatePassword } from "./password";

// Deutscher Fake-Data-Generator – rein clientseitig, nur zu Test-/Demozwecken.
// Adress-/Bank-/Firmendaten sind PLAUSIBEL, aber frei erfunden.

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FIRST_NAMES_MALE = [
  "Lukas", "Leon", "Finn", "Paul", "Felix", "Jonas", "Maximilian", "Elias", "Noah", "Ben",
  "Tim", "Jan", "Tobias", "Simon", "David", "Niklas", "Julian", "Moritz", "Philipp", "Sebastian",
];
const FIRST_NAMES_FEMALE = [
  "Mia", "Emma", "Hannah", "Sofia", "Lena", "Emilia", "Anna", "Lea", "Marie", "Laura",
  "Johanna", "Sarah", "Julia", "Nele", "Clara", "Lisa", "Katharina", "Sophie", "Vanessa", "Nina",
];
const LAST_NAMES = [
  "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann",
  "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann",
  "Braun", "Krüger", "Hofmann", "Hartmann", "Lange", "Werner", "Krause", "Meier", "Lehmann", "Huber",
];

// Reale PLZ-Präfix/Stadt/Bundesland-Kombinationen (Auswahl größerer Städte)
const CITIES = [
  { plz: "10115", city: "Berlin", state: "Berlin" },
  { plz: "20095", city: "Hamburg", state: "Hamburg" },
  { plz: "80331", city: "München", state: "Bayern" },
  { plz: "50667", city: "Köln", state: "Nordrhein-Westfalen" },
  { plz: "60311", city: "Frankfurt am Main", state: "Hessen" },
  { plz: "70173", city: "Stuttgart", state: "Baden-Württemberg" },
  { plz: "40213", city: "Düsseldorf", state: "Nordrhein-Westfalen" },
  { plz: "04109", city: "Leipzig", state: "Sachsen" },
  { plz: "44135", city: "Dortmund", state: "Nordrhein-Westfalen" },
  { plz: "45127", city: "Essen", state: "Nordrhein-Westfalen" },
  { plz: "28195", city: "Bremen", state: "Bremen" },
  { plz: "01067", city: "Dresden", state: "Sachsen" },
  { plz: "30159", city: "Hannover", state: "Niedersachsen" },
  { plz: "90402", city: "Nürnberg", state: "Bayern" },
  { plz: "47051", city: "Duisburg", state: "Nordrhein-Westfalen" },
  { plz: "44787", city: "Bochum", state: "Nordrhein-Westfalen" },
  { plz: "42103", city: "Wuppertal", state: "Nordrhein-Westfalen" },
  { plz: "33602", city: "Bielefeld", state: "Nordrhein-Westfalen" },
  { plz: "53111", city: "Bonn", state: "Nordrhein-Westfalen" },
  { plz: "48143", city: "Münster", state: "Nordrhein-Westfalen" },
  { plz: "68159", city: "Mannheim", state: "Baden-Württemberg" },
  { plz: "86150", city: "Augsburg", state: "Bayern" },
  { plz: "65183", city: "Wiesbaden", state: "Hessen" },
  { plz: "39104", city: "Magdeburg", state: "Sachsen-Anhalt" },
  { plz: "24103", city: "Kiel", state: "Schleswig-Holstein" },
  { plz: "55116", city: "Mainz", state: "Rheinland-Pfalz" },
  { plz: "99084", city: "Erfurt", state: "Thüringen" },
  { plz: "18055", city: "Rostock", state: "Mecklenburg-Vorpommern" },
  { plz: "66111", city: "Saarbrücken", state: "Saarland" },
  { plz: "26122", city: "Oldenburg", state: "Niedersachsen" },
];

const STREETS = [
  "Hauptstraße", "Bahnhofstraße", "Schulstraße", "Gartenstraße", "Kirchstraße",
  "Bergstraße", "Waldstraße", "Ringstraße", "Am Markt", "Lindenallee",
  "Goethestraße", "Schillerstraße", "Wiesenweg", "Birkenweg", "Industriestraße",
];

const COMPANY_PREFIXES = ["Nord", "Süd", "Rhein", "Bayern", "Tech", "Digital", "Meta", "Neo", "Pro", "Elbe"];
const COMPANY_SUFFIXES = ["Systeme", "Solutions", "Consulting", "Logistik", "Dienstleistungen", "Software", "Industrie", "Group", "Technik", "Service"];
const COMPANY_FORMS = ["GmbH", "AG", "GmbH & Co. KG", "e.K."];
const DEPARTMENTS = ["IT", "Vertrieb", "Marketing", "Personal", "Buchhaltung", "Support", "Einkauf", "Produktion", "Logistik", "Geschäftsführung"];
const POSITIONS = ["Sachbearbeiter/in", "Teamleiter/in", "Fachinformatiker/in", "Projektmanager/in", "Abteilungsleiter/in", "Auszubildende/r", "Werkstudent/in", "Systemadministrator/in"];

const EMAIL_DOMAINS = ["gmail.com", "web.de", "gmx.de", "outlook.de", "t-online.de"];
const GERMAN_BANK_CODES = ["10070000", "20070000", "30070000", "37040044", "50010517", "60050101", "70050000", "76050101"];
const BANK_NAMES: Record<string, string> = {
  "10070000": "Deutsche Bank",
  "20070000": "Deutsche Bank",
  "30070000": "Deutsche Bank",
  "37040044": "Commerzbank",
  "50010517": "ING-DiBa",
  "60050101": "Baden-Württembergische Bank",
  "70050000": "Bayerische Landesbank",
  "76050101": "Sparkasse Nürnberg",
};

export interface Person {
  firstName: string;
  lastName: string;
  gender: "männlich" | "weiblich";
  birthDate: string;
}

export function generatePerson(): Person {
  const gender: "männlich" | "weiblich" = Math.random() < 0.5 ? "männlich" : "weiblich";
  const firstName = gender === "männlich" ? pick(FIRST_NAMES_MALE) : pick(FIRST_NAMES_FEMALE);
  const lastName = pick(LAST_NAMES);
  const year = randomInt(1955, 2005);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const birthDate = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
  return { firstName, lastName, gender, birthDate };
}

export interface Address {
  street: string;
  houseNumber: number;
  plz: string;
  city: string;
  state: string;
}

export function generateAddress(): Address {
  const location = pick(CITIES);
  return {
    street: pick(STREETS),
    houseNumber: randomInt(1, 180),
    plz: location.plz,
    city: location.city,
    state: location.state,
  };
}

export interface Contact {
  phone: string;
  mobile: string;
  email: string;
}

export function generateContact(firstName: string, lastName: string): Contact {
  const areaCode = pick(["030", "040", "069", "089", "0221", "0211", "0511"]);
  const phone = `${areaCode} ${randomInt(1000000, 9999999)}`;
  const mobile = `01${pick(["51", "52", "57", "60", "63", "70", "71", "75"])} ${randomInt(1000000, 9999999)}`;
  const emailName = normalizeForEmail(`${firstName}.${lastName}`);
  const email = `${emailName}${randomInt(1, 99)}@${pick(EMAIL_DOMAINS)}`;
  return { phone, mobile, email };
}

function normalizeForEmail(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z.]/g, "");
}

export interface LoginData {
  usernames: { format: string; value: string }[];
  password: string;
  pin: string;
}

export function generateLoginData(firstName: string, lastName: string): LoginData {
  return {
    usernames: generateUsernames(firstName, lastName),
    password: generatePassword({ length: 14, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true }),
    pin: String(randomInt(1000, 9999)),
  };
}

export interface Company {
  name: string;
  department: string;
  position: string;
  companyEmail: string;
  vatId: string;
}

export function generateCompany(firstName?: string, lastName?: string): Company {
  const name = `${pick(COMPANY_PREFIXES)}${pick(COMPANY_SUFFIXES)} ${pick(COMPANY_FORMS)}`;
  const domain = normalizeForEmail(name.split(" ")[0]) + ".de";
  const emailUser = firstName && lastName ? normalizeForEmail(`${firstName}.${lastName}`) : "info";
  return {
    name,
    department: pick(DEPARTMENTS),
    position: pick(POSITIONS),
    companyEmail: `${emailUser}@${domain}`,
    vatId: `DE${randomInt(100000000, 999999999)}`,
  };
}

// IBAN-Prüfziffer nach ISO 7064 (MOD 97-10) berechnen
function ibanCheckDigits(countryCode: string, bban: string): string {
  const rearranged = bban + countryCode + "00";
  const numeric = rearranged
    .split("")
    .map((c) => (/[0-9]/.test(c) ? c : String(c.toUpperCase().charCodeAt(0) - 55)))
    .join("");

  const big = BigInt(numeric);
  const remainder = big % BigInt(97);
  const check = BigInt(98) - remainder;
  return check.toString().padStart(2, "0");
}

export interface FinanceData {
  iban: string;
  bic: string;
  bankName: string;
  creditCardNumber: string;
}

function luhnCheckDigit(digits: string): string {
  let sum = 0;
  let double = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return String((10 - (sum % 10)) % 10);
}

export function generateFinance(): FinanceData {
  const blz = pick(GERMAN_BANK_CODES);
  const account = String(randomInt(0, 9999999999)).padStart(10, "0");
  const bban = blz + account;
  const check = ibanCheckDigits("DE", bban);
  const iban = `DE${check}${bban}`;
  const formattedIban = iban.match(/.{1,4}/g)!.join(" ");

  const bic = `${blz.substring(0, 4).toUpperCase().padEnd(4, "X")}DE${randomInt(10, 99)}`;

  const cardBase = "453987" + String(randomInt(0, 999999999)).padStart(9, "0"); // Visa-artiges Präfix
  const creditCardNumber = cardBase + luhnCheckDigit(cardBase);
  const formattedCard = creditCardNumber.match(/.{1,4}/g)!.join(" ");

  return { iban: formattedIban, bic, bankName: BANK_NAMES[blz] || "Musterbank", creditCardNumber: formattedCard };
}

export interface ItData {
  ip: string;
  mac: string;
  hostname: string;
  computerName: string;
  uuid: string;
}

export function generateItData(lastName?: string): ItData {
  const ip = `192.168.${randomInt(0, 254)}.${randomInt(1, 254)}`;
  const mac = Array.from({ length: 6 }, () => randomInt(0, 255).toString(16).padStart(2, "0").toUpperCase()).join(":");
  const suffix = lastName ? normalizeForEmail(lastName).toUpperCase().substring(0, 6) : "PC";
  const hostname = `${suffix}-${randomInt(100, 999)}`;
  const computerName = `WS-${suffix}${randomInt(1, 99)}`;
  const uuid = crypto.randomUUID();
  return { ip, mac, hostname, computerName, uuid };
}

export interface FullPerson {
  person: Person;
  address: Address;
  contact: Contact;
  login: LoginData;
  company: Company;
  finance: FinanceData;
  it: ItData;
}

export function generateFullPerson(): FullPerson {
  const person = generatePerson();
  return {
    person,
    address: generateAddress(),
    contact: generateContact(person.firstName, person.lastName),
    login: generateLoginData(person.firstName, person.lastName),
    company: generateCompany(person.firstName, person.lastName),
    finance: generateFinance(),
    it: generateItData(person.lastName),
  };
}

// Massenexport als flache Zeilen für CSV/JSON/SQL
export function flattenPerson(p: FullPerson): Record<string, string> {
  return {
    vorname: p.person.firstName,
    nachname: p.person.lastName,
    geschlecht: p.person.gender,
    geburtsdatum: p.person.birthDate,
    strasse: p.address.street,
    hausnummer: String(p.address.houseNumber),
    plz: p.address.plz,
    stadt: p.address.city,
    bundesland: p.address.state,
    telefon: p.contact.phone,
    mobil: p.contact.mobile,
    email: p.contact.email,
    benutzername: p.login.usernames[0]?.value || "",
    passwort: p.login.password,
    pin: p.login.pin,
    firma: p.company.name,
    abteilung: p.company.department,
    position: p.company.position,
    firmen_email: p.company.companyEmail,
    ust_id: p.company.vatId,
    iban: p.finance.iban,
    bic: p.finance.bic,
    kreditkarte: p.finance.creditCardNumber,
    ip: p.it.ip,
    mac: p.it.mac,
    hostname: p.it.hostname,
    computername: p.it.computerName,
    uuid: p.it.uuid,
  };
}

export function exportAsCsv(rows: Record<string, string>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [headers.join(";"), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(";"))];
  return lines.join("\n");
}

export function exportAsJson(rows: Record<string, string>[]): string {
  return JSON.stringify(rows, null, 2);
}

export function exportAsSql(rows: Record<string, string>[], tableName = "testdaten"): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string) => `'${v.replace(/'/g, "''")}'`;
  const values = rows.map((r) => `  (${headers.map((h) => escape(r[h] ?? "")).join(", ")})`);
  return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES\n${values.join(",\n")};`;
}
