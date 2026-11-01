// Seeds the Sanity dataset with the starting site settings and volunteer
// opportunities, then checks the document counts. Safe to run more than once.
//
//   npm.cmd run seed                 adds anything missing, leaves the rest alone
//   npm.cmd run seed -- --replace    resets these documents to the text below,
//                                    overwriting edits made in the Studio
//
// Uses the Sanity CLI login (npx.cmd sanity login). Document IDs contain no dots
// because Sanity hides dotted IDs from public visitors.

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const seedFile = join(here, "seed.ndjson");
const sanityBin = join(root, "node_modules", "sanity", "bin", "sanity");

function block(key, text, list = false) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    ...(list ? { listItem: "bullet", level: 1 } : {}),
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    membershipRequirements: [
      "Be a currently enrolled FSU student.",
      "Join the Rural ACCESS roster on FSU HQ.",
      "Pay $10 annual dues (covers fall and spring) to become an active member. Active members earn points, vote, and can run for office.",
      "Can't afford dues? Ask the President or Treasurer about a confidential waiver. No student is turned away for inability to pay.",
    ],
    pointsSummary: [
      block(
        "points-intro",
        "Active members (dues paid for the year) earn points by taking part:",
      ),
      block(
        "points-one",
        "1 point for each general body meeting, monthly training or faculty presentation, respite session with The Alzheimer's Project, or health screening you're selected for. Officers may designate other events as point-earning and will announce it beforehand.",
        true,
      ),
      block(
        "points-half",
        "½ point for arriving early to set up or staying late to clean up at social events and other designated events (once per event).",
        true,
      ),
      block(
        "points-credit",
        "Sign in at each event and stay for most of it to receive credit. Points reset each August and count toward voting and running for office.",
      ),
    ],
    screeningSelection: [
      block(
        "screening",
        "Spots at blood pressure and other health screenings are set by the partner hosting them and are limited. To be considered, you need to be an active member in good standing, complete the screening-support training, and sign up by the deadline. Members are ranked by the points they've earned since their last screening, so active members who haven't attended one recently get priority.",
      ),
    ],
  },
  {
    _id: "volunteerOpportunity-respite-volunteer",
    _type: "volunteerOpportunity",
    title: "Respite Volunteer",
    organization: "The Alzheimer's Project",
    status: "open",
    summary:
      "Spend time with older adults living with memory loss in The Alzheimer's Project's respite rooms, giving their caregivers a few hours of rest.",
    requirements: [
      "Attend a three-hour volunteer training class.",
      "Complete The Alzheimer's Project's volunteer application forms.",
      "Complete a short (about 10-minute) interview with Alzheimer's Project staff.",
    ],
    howToStart:
      "Email us at ruralaccessatfsu@gmail.com, and our Community Engagement Coordinator will help you get started and schedule your sessions.",
    pointsNote: "Active members earn 1 point per respite session.",
    order: 1,
    hidden: false,
  },
  {
    _id: "volunteerOpportunity-tallahassee-senior-center",
    _type: "volunteerOpportunity",
    title: "Tallahassee Senior Center",
    status: "coming-soon",
    summary:
      "Social and health outreach events with local seniors. Volunteer requirements are being finalized; check back soon.",
    order: 2,
    hidden: false,
  },
];

function sanity(...args) {
  const result = spawnSync(process.execPath, [sanityBin, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr);
    process.exit(1);
  }
  return result.stdout;
}

const mode = process.argv.includes("--replace") ? "--replace" : "--missing";

writeFileSync(
  seedFile,
  documents.map((document) => JSON.stringify(document)).join("\n") + "\n",
);

console.log(sanity("datasets", "import", seedFile, "--dataset", "production", mode));

const counts = JSON.parse(
  sanity(
    "documents",
    "query",
    "--api-version",
    "2026-11-01",
    `{
      "siteSettings": count(*[_type == "siteSettings"]),
      "volunteerOpportunity": count(*[_type == "volunteerOpportunity"]),
      "event": count(*[_type == "event"]),
      "officer": count(*[_type == "officer"])
    }`,
  ),
);

console.log("Document counts:", counts);

if (counts.siteSettings !== 1 || counts.volunteerOpportunity < 2) {
  console.error("Expected one siteSettings and at least two volunteerOpportunity documents.");
  process.exit(1);
}
