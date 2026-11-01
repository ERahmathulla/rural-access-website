import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineField, defineType } from "sanity";

import { formatDateRange, TIME_ZONE } from "../../lib/datetime";
import { NO_END_GRACE_HOURS } from "../../lib/events";
import { AUDIENCES, EVENT_TYPES, POINTS } from "../options";

const eastern = {
  timeStep: 15,
  displayTimeZone: TIME_ZONE,
  allowTimeZoneSwitch: false,
};

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The event name, as it should appear on the website.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      description: "The kind of event. Visitors can filter the list by this.",
      options: { list: EVENT_TYPES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      title: "Start",
      type: "datetime",
      description: "When the event begins, in Eastern time.",
      options: eastern,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "End",
      type: "datetime",
      description: `When the event finishes, in Eastern time. If left empty, the event stays listed for ${NO_END_GRACE_HOURS} hours after it starts.`,
      options: eastern,
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = context.document?.start as string | undefined;
          if (end && start && new Date(end) <= new Date(start)) {
            return "The end must be after the start.";
          }
          return true;
        }),
    }),
    defineField({
      name: "locationName",
      title: "Location name",
      type: "string",
      description: "The place or room, as people would say it.",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      description: "Street address. Adding one shows a Map link on the event.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "A short note on what will happen and what to bring.",
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description:
        'Who can come. "Open to everyone" stands out on the website for non-FSU visitors.',
      options: { list: AUDIENCES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "points",
      title: "Points",
      type: "string",
      description: "How many points members earn for attending.",
      options: { list: POINTS, layout: "radio" },
      initialValue: "none",
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      description:
        "Who hosts this, if it isn't us. Useful for independent volunteering.",
    }),
    defineField({
      name: "signupUrl",
      title: "Sign-up link",
      type: "url",
      description: "Where people sign up. Adds a Sign up button to the event.",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "signupDeadline",
      title: "Sign-up deadline",
      type: "datetime",
      description:
        "The last moment to sign up, in Eastern time. After this the Sign up button is replaced with a closed note.",
      options: eastern,
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      description: "Turn on to keep this off the website without deleting it.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", start: "start", end: "end", hidden: "hidden" },
    prepare: ({ title, start, end, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: start ? formatDateRange(start, end) : "No start date yet",
    }),
  },
});
