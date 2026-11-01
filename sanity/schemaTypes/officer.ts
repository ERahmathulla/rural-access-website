import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

import { OFFICER_ROLES, optionTitle } from "../options";

export const officer = defineType({
  name: "officer",
  title: "E-board member",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Full name, as it should appear on the website.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        "Their position. The website lists the e-board in the order of this list.",
      options: { list: OFFICER_ROLES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description:
        "A square-ish headshot. Without one, the website shows their initials.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describes the photo for people using screen readers, such as \"Smiling outdoors on campus\".",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const photo = context.parent as { asset?: unknown } | undefined;
              return photo?.asset && !alt
                ? "Please describe the photo."
                : true;
            }),
        }),
      ],
    }),
    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 3,
      description: "One or two friendly sentences, 200 characters at most.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Only matters when two people share a role. Lower numbers show first.",
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
    select: { title: "name", role: "role", media: "photo", hidden: "hidden" },
    prepare: ({ title, role, media, hidden }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: optionTitle(OFFICER_ROLES, role),
      media,
    }),
  },
});
