// Choices shared by the Studio schemas and the website.

export const EVENT_TYPES = [
  { title: "General Body Meeting", value: "general-body-meeting" },
  { title: "Training", value: "training" },
  { title: "Club Volunteering & Outreach", value: "club-volunteering-outreach" },
  { title: "Independent Volunteering", value: "independent-volunteering" },
  { title: "Social", value: "social" },
];

export const AUDIENCES = [
  { title: "Open to everyone", value: "everyone" },
  { title: "FSU students", value: "fsu-students" },
  { title: "Members only", value: "members" },
];

export const POINTS = [
  { title: "No points", value: "none" },
  { title: "1 point", value: "one" },
  { title: "1 point (+½ for setup or cleanup)", value: "one-plus-half" },
];

// Listed in the order officers appear on the website.
export const OFFICER_ROLES = [
  { title: "President", value: "president" },
  { title: "Vice President", value: "vice-president" },
  { title: "Treasurer", value: "treasurer" },
  { title: "Secretary", value: "secretary" },
  {
    title: "Education & Outreach Coordinator",
    value: "education-outreach-coordinator",
  },
  {
    title: "Community Engagement Coordinator",
    value: "community-engagement-coordinator",
  },
  { title: "Historian", value: "historian" },
  {
    title: "Marketing & Communications Coordinator",
    value: "marketing-communications-coordinator",
  },
  { title: "Faculty Advisor", value: "faculty-advisor" },
];

export const VOLUNTEER_STATUSES = [
  { title: "Open", value: "open" },
  { title: "Coming soon", value: "coming-soon" },
];

export function optionTitle(
  options: { title: string; value: string }[],
  value: string | undefined,
) {
  return options.find((option) => option.value === value)?.title;
}
