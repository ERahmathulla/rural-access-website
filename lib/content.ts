import { createClient, type QueryParams } from "@sanity/client";
import { cacheLife } from "next/cache";

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

// Sanity requests skip Next's fetch cache, which outlives deployments and keeps
// responses for 15 minutes, so that "use cache" below is the only cache here.
function query<T>(groq: string, params: QueryParams = {}) {
  return client.fetch<T>(groq, params, { cache: "no-store" });
}

// Each fetcher uses the "minutes" cache profile: content refreshes after 60
// seconds, and nothing older than an hour is served, so a quiet site doesn't
// greet its next visitor with long-gone events.

export async function getSiteSettings() {
  "use cache";
  cacheLife("minutes");
  return query<SiteSettings | null>(`*[_id == "siteSettings"][0]`);
}

export async function getUpcomingEvents() {
  "use cache";
  cacheLife("minutes");
  return query<EventDoc[]>(
    `*[_type == "event" && hidden != true && ${upcomingFilter("$now")}] | order(start asc)`,
    { now: new Date().toISOString() },
  );
}

export async function getCalendarEvent(id: string) {
  "use cache";
  cacheLife("minutes");
  return query<EventDoc | null>(
    `*[_type == "event" && _id == $id && hidden != true][0]`,
    { id },
  );
}

function roleRank(officer: Officer) {
  return OFFICER_ROLES.findIndex((role) => role.value === officer.role);
}

export async function getOfficers() {
  "use cache";
  cacheLife("minutes");
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
  "use cache";
  cacheLife("minutes");
  return query<VolunteerOpportunity[]>(
    `*[_type == "volunteerOpportunity" && hidden != true] | order(coalesce(order, 9999) asc, title asc)`,
  );
}
