import type { Metadata } from "next";

import { type EventCardData, EventList } from "@/components/event-list";
import { JoinButton } from "@/components/join-button";
import { MembershipRequirements } from "@/components/membership-requirements";
import { RichText } from "@/components/rich-text";
import { VolunteerCard } from "@/components/volunteer-card";
import {
  getSiteSettings,
  getUpcomingEvents,
  getVolunteerOpportunities,
} from "@/lib/content";
import { formatDateRange, formatDateTime } from "@/lib/datetime";
import { eventVisibleUntil } from "@/lib/events";
import type { EventDoc } from "@/lib/types";
import {
  AUDIENCES,
  EVENT_TYPES,
  optionTitle,
  POINTS,
} from "@/sanity/options";

export const metadata: Metadata = {
  title: "Events & Get Involved",
  description:
    "Upcoming Rural ACCESS events and meetings, membership requirements, volunteer opportunities, and how points work.",
};

function toEventCard(event: EventDoc): EventCardData {
  return {
    id: event._id,
    title: event.title,
    type: event.type,
    typeLabel: optionTitle(EVENT_TYPES, event.type) ?? "Event",
    when: formatDateRange(event.start, event.end),
    locationName: event.locationName,
    address: event.address,
    mapUrl: event.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
      : undefined,
    organization: event.organization,
    description: event.description,
    audience: event.audience,
    audienceLabel: optionTitle(AUDIENCES, event.audience),
    pointsLabel:
      event.points && event.points !== "none"
        ? optionTitle(POINTS, event.points)
        : undefined,
    signupUrl: event.signupUrl,
    signupDeadlineLabel: event.signupDeadline
      ? formatDateTime(event.signupDeadline)
      : undefined,
    signupClosesAt: event.signupDeadline
      ? new Date(event.signupDeadline).getTime()
      : undefined,
    visibleUntil: eventVisibleUntil(event.start, event.end),
  };
}

export default async function GetInvolvedPage() {
  const [settings, events, opportunities] = await Promise.all([
    getSiteSettings(),
    getUpcomingEvents(),
    getVolunteerOpportunities(),
  ]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14">
        <h1 className="text-4xl md:text-5xl">Events &amp; Get Involved</h1>
      </div>

      <section id="events">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
          <h2 className="section-heading">Upcoming Events &amp; Meetings</h2>
          <EventList events={events.map(toEventCard)} />
        </div>
      </section>

      <section id="get-involved" className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <h2 className="section-heading">How to Get Involved</h2>

          <div className="mt-8 max-w-3xl">
            <MembershipRequirements
              requirements={settings?.membershipRequirements}
            />
            <div className="mt-6 flex flex-col sm:flex-row">
              <JoinButton joinUrl={settings?.joinUrl} />
            </div>
          </div>

          {opportunities.length > 0 && (
            <>
              <h3 className="mt-14 text-3xl">Volunteer opportunities</h3>
              <ul className="mt-6 grid items-start gap-5 md:grid-cols-2">
                {opportunities.map((opportunity) => (
                  <li key={opportunity._id}>
                    <VolunteerCard opportunity={opportunity} />
                  </li>
                ))}
              </ul>
            </>
          )}

          <div id="points" className="mt-14 max-w-3xl">
            <h3 className="text-3xl">Points &amp; active status</h3>
            {settings?.pointsSummary && (
              <div className="mt-4">
                <RichText value={settings.pointsSummary} />
              </div>
            )}
            <h4 className="mt-8 text-2xl">Health screenings</h4>
            {settings?.screeningSelection && (
              <div className="mt-3">
                <RichText value={settings.screeningSelection} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
