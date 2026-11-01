import { CalendarIcon } from "@sanity/icons/Calendar";
import { ClockIcon } from "@sanity/icons/Clock";
import { CogIcon } from "@sanity/icons/Cog";
import { HeartIcon } from "@sanity/icons/Heart";
import { UsersIcon } from "@sanity/icons/Users";
import type { StructureResolver } from "sanity/structure";

import { upcomingFilter } from "../lib/events";
import { apiVersion } from "./env";

const isUpcoming = upcomingFilter("now()");

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.listItem()
        .title("Upcoming events")
        .icon(CalendarIcon)
        .child(
          S.documentList()
            .title("Upcoming events")
            .schemaType("event")
            .apiVersion(apiVersion)
            // Include events with no start yet so unfinished drafts stay findable.
            .filter(`_type == "event" && (!defined(start) || ${isUpcoming})`)
            .defaultOrdering([{ field: "start", direction: "asc" }]),
        ),
      S.listItem()
        .title("Past events")
        .icon(ClockIcon)
        .child(
          S.documentList()
            .title("Past events")
            .schemaType("event")
            .apiVersion(apiVersion)
            .filter(`_type == "event" && defined(start) && !(${isUpcoming})`)
            .defaultOrdering([{ field: "start", direction: "desc" }]),
        ),
      S.listItem()
        .title("E-board")
        .icon(UsersIcon)
        .child(
          S.documentTypeList("officer")
            .title("E-board")
            .apiVersion(apiVersion),
        ),
      S.listItem()
        .title("Volunteer opportunities")
        .icon(HeartIcon)
        .child(
          S.documentTypeList("volunteerOpportunity")
            .title("Volunteer opportunities")
            .apiVersion(apiVersion)
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
    ]);
