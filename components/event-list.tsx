"use client";

import { useState, useSyncExternalStore } from "react";

import { INSTAGRAM_URL } from "@/lib/site";
import { EVENT_TYPES } from "@/sanity/options";

// Dates arrive already formatted so the server and browser can't disagree on
// the text during hydration.
export type EventCardData = {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  when: string;
  locationName?: string;
  address?: string;
  mapUrl?: string;
  organization?: string;
  description?: string;
  audience: string;
  audienceLabel?: string;
  pointsLabel?: string;
  signupUrl?: string;
  signupDeadlineLabel?: string;
  signupClosesAt?: number;
  visibleUntil: number;
};

const MINUTE = 60_000;

function subscribeToClock(onTick: () => void) {
  const timer = setInterval(onTick, MINUTE);
  return () => clearInterval(timer);
}

function readClock() {
  return Math.floor(Date.now() / MINUTE) * MINUTE;
}

function readClockOnServer() {
  return null;
}

function EventCard({
  event,
  now,
}: {
  event: EventCardData;
  now: number | null;
}) {
  const signupClosed =
    event.signupClosesAt !== undefined &&
    now !== null &&
    now > event.signupClosesAt;
  const hasLocation = event.locationName || event.address;

  return (
    <article className="card h-full">
      <p className="font-bold">{event.typeLabel}</p>
      <h3 className="mt-1 text-2xl">{event.title}</h3>

      <dl className="mt-3 space-y-1">
        <div>
          <dt className="sr-only">When</dt>
          <dd className="font-bold">{event.when}</dd>
        </div>
        {hasLocation && (
          <div>
            <dt className="sr-only">Where</dt>
            <dd>
              {[event.locationName, event.address].filter(Boolean).join(", ")}
              {event.mapUrl && (
                <>
                  {" "}
                  <a href={event.mapUrl}>
                    Map<span className="sr-only"> of {event.title}</span>
                  </a>
                </>
              )}
            </dd>
          </div>
        )}
        {event.organization && (
          <div>
            <dt className="sr-only">Host</dt>
            <dd>Hosted by {event.organization}</dd>
          </div>
        )}
      </dl>

      {event.description && (
        <p className="mt-3 whitespace-pre-line">{event.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {event.audienceLabel && (
          <span
            className={`badge ${event.audience === "everyone" ? "badge-gold" : ""}`}
          >
            {event.audienceLabel}
          </span>
        )}
        {event.pointsLabel && (
          <span className="badge badge-amber">{event.pointsLabel}</span>
        )}
      </div>

      {signupClosed ? (
        <p className="mt-4 font-bold">Sign-up closed</p>
      ) : (
        event.signupDeadlineLabel && (
          <p className="mt-4 font-bold">
            Sign up by {event.signupDeadlineLabel}
          </p>
        )
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {event.signupUrl && !signupClosed && (
          <a href={event.signupUrl} className="btn btn-primary">
            Sign up<span className="sr-only"> for {event.title}</span>
          </a>
        )}
        <a
          href={`/events/${event.id}/calendar.ics`}
          download
          rel="nofollow"
          className="btn btn-secondary"
        >
          Add to calendar<span className="sr-only">: {event.title}</span>
        </a>
      </div>
    </article>
  );
}

export function EventList({ events }: { events: EventCardData[] }) {
  // A cached page can outlive an event, so recheck against the visitor's clock.
  const now = useSyncExternalStore(
    subscribeToClock,
    readClock,
    readClockOnServer,
  );
  const [selectedType, setSelectedType] = useState("all");

  const upcoming =
    now === null ? events : events.filter((event) => event.visibleUntil >= now);

  if (upcoming.length === 0) {
    return (
      <p className="card mt-6">
        Meeting and event dates for this semester are coming soon. Follow{" "}
        <a href={INSTAGRAM_URL}>@ruralaccessfsu on Instagram</a> for updates.
      </p>
    );
  }

  const shown =
    selectedType === "all"
      ? upcoming
      : upcoming.filter((event) => event.type === selectedType);
  const chips = [{ title: "All", value: "all" }, ...EVENT_TYPES];

  return (
    <>
      <div
        role="group"
        aria-label="Filter by type"
        className="mt-6 flex flex-wrap gap-2"
      >
        {chips.map(({ title, value }) => (
          <button
            key={value}
            type="button"
            aria-pressed={selectedType === value}
            onClick={() => setSelectedType(value)}
            className="min-h-11 rounded-full border-2 border-garnet px-4 py-1 font-bold text-garnet hover:bg-garnet/10 aria-pressed:bg-garnet aria-pressed:text-cream"
          >
            {title}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {shown.length} {shown.length === 1 ? "event" : "events"} shown
      </p>

      {shown.length > 0 ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {shown.map((event) => (
            <li key={event.id}>
              <EventCard event={event} now={now} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="card mt-6">No upcoming events of this type right now.</p>
      )}
    </>
  );
}
