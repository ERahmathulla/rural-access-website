import type { PortableTextProps } from "@portabletext/react";

export type RichTextValue = PortableTextProps["value"];

export type SiteSettings = {
  joinUrl?: string;
  membershipRequirements?: string[];
  pointsSummary?: RichTextValue;
  screeningSelection?: RichTextValue;
};

export type EventDoc = {
  _id: string;
  _updatedAt: string;
  title: string;
  type: string;
  start: string;
  end?: string;
  locationName?: string;
  address?: string;
  description?: string;
  audience: string;
  points?: string;
  organization?: string;
  signupUrl?: string;
  signupDeadline?: string;
};

export type Officer = {
  _id: string;
  name: string;
  role: string;
  photo?: {
    asset: { _ref: string };
    alt?: string;
  };
  shortBio?: string;
  order?: number;
};

export type VolunteerOpportunity = {
  _id: string;
  title: string;
  organization?: string;
  status?: string;
  summary?: string;
  requirements?: string[];
  howToStart?: string;
  pointsNote?: string;
};
