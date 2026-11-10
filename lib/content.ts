import { createClient, type QueryParams } from "@sanity/client";
import { connection } from "next/server";

import { upcomingFilter } from "@/lib/events";
import type {
  EventDoc,
  Officer,
  SiteSettings,
  VolunteerOpportunity,
} from "@/lib/types";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { OFFICER_ROLES } from "@/sanity/options";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// Every Sanity read happens at request time, so each visitor gets current
// content. Nothing is cached in Next.js: connection() keeps these reads out of
// prerendering, and "no-store" skips Next's fetch cache, which outlives
// deployments. Sanity's own CDN still answers the queries.
async function query<T>(groq: string, params: QueryParams = {}) {
  await connection();
  return client.fetch<T>(groq, params, { cache: "no-store" });
}

export async function getSiteSettings() {
  return query<SiteSettings | null>(`*[_id == "siteSettings"][0]`);
}

export async function getUpcomingEvents() {
  // Read the clock only once the request has arrived.
  await connection();
  return query<EventDoc[]>(
    `*[_type == "event" && hidden != true && ${upcomingFilter("$now")}] | order(start asc)`,
    { now: new Date().toISOString() },
  );
}

export async function getCalendarEvent(id: string) {
  return query<EventDoc | null>(
    `*[_type == "event" && _id == $id && hidden != true][0]`,
    { id },
  );
}

function roleRank(officer: Officer) {
  return OFFICER_ROLES.findIndex((role) => role.value === officer.role);
}

export async function getOfficers() {
  const officers = await query<Officer[]>(
    `*[_type == "officer" && hidden != true]`,
  );
  return officers.sort(
    (a, b) =>
      roleRank(a) - roleRank(b) ||
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.name.localeCompare(b.name),
  );
}

export async function getVolunteerOpportunities() {
  return query<VolunteerOpportunity[]>(
    `*[_type == "volunteerOpportunity" && hidden != true] | order(coalesce(order, 9999) asc, title asc)`,
  );
}
