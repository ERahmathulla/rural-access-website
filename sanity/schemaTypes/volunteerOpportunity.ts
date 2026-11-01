import { HeartIcon } from "@sanity/icons/Heart";
import { defineArrayMember, defineField, defineType } from "sanity";

import { optionTitle, VOLUNTEER_STATUSES } from "../options";

export const volunteerOpportunity = defineType({
  name: "volunteerOpportunity",
  title: "Volunteer opportunity",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the opportunity.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      description: "The partner this is with, if there is one.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        'Choose "Coming soon" to show only the summary and a "Details coming soon" note.',
      options: { list: VOLUNTEER_STATUSES, layout: "radio" },
      initialValue: "open",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "A sentence or two on what volunteers do.",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      description:
        "What someone must do before volunteering, one short item per line. Hidden while the status is Coming soon.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "howToStart",
      title: "How to start",
      type: "text",
      rows: 3,
      description:
        "The first step someone should take. Email addresses become links.",
    }),
    defineField({
      name: "pointsNote",
      title: "Points note",
      type: "string",
      description: "Optional. How many points this earns, if any.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Where this card sits on the page. Lower numbers show first.",
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      description: "Turn on to keep this off the website without deleting it.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Website order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", status: "status", hidden: "hidden" },
    prepare: ({ title, status, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: optionTitle(VOLUNTEER_STATUSES, status),
    }),
  },
});
