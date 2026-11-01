import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const richText = [
  defineArrayMember({
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: [
      { title: "Bullets", value: "bullet" },
      { title: "Numbers", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              type: "url",
              title: "Web address",
              description: "The page this text should link to.",
              validation: (rule) =>
                rule.uri({ scheme: ["http", "https", "mailto"] }),
            }),
          ],
        }),
      ],
    },
  }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "joinUrl",
      title: "Join link (FSU HQ)",
      type: "url",
      description:
        "Our FSU HQ page. Every Join button goes here. If left empty, Join buttons open an email to the club instead.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "membershipRequirements",
      title: "Membership requirements",
      type: "array",
      description:
        "What it takes to become a member. Shown on both pages of the site, one short item per line.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "pointsSummary",
      title: "Points summary",
      type: "array",
      description:
        "Explains how members earn points. Shown under Points & active status on the Events & Get Involved page.",
      of: richText,
    }),
    defineField({
      name: "screeningSelection",
      title: "Health screening selection",
      type: "array",
      description:
        "Explains how members are chosen for health screenings. Shown under Health screenings on the Events & Get Involved page.",
      of: richText,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
