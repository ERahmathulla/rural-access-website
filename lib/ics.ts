import { TIME_ZONE, toIcsLocalTime, toIcsUtcTime } from "@/lib/datetime";
import type { EventDoc } from "@/lib/types";

const MAX_LINE_BYTES = 75;

const NEW_YORK_TIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TIME_ZONE}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0400",
  "TZNAME:EDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0400",
  "TZOFFSETTO:-0500",
  "TZNAME:EST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Calendar files wrap long lines by byte count, without splitting a character.
function foldLine(line: string) {
  const chunks: string[] = [];
  let chunk = "";
  let bytes = 0;

  for (const character of line) {
    const size = Buffer.byteLength(character);
    if (bytes + size > MAX_LINE_BYTES) {
      chunks.push(chunk);
      chunk = " ";
      bytes = 1;
    }
    chunk += character;
    bytes += size;
  }
  chunks.push(chunk);

  return chunks.join("\r\n");
}

export function buildIcs(event: EventDoc) {
  const location = [event.locationName, event.address]
    .filter(Boolean)
    .join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rural ACCESS//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...NEW_YORK_TIMEZONE,
    "BEGIN:VEVENT",
    `UID:${event._id}@rural-access`,
    `DTSTAMP:${toIcsUtcTime(event._updatedAt)}`,
    `DTSTART;TZID=${TIME_ZONE}:${toIcsLocalTime(event.start)}`,
    ...(event.end
      ? [`DTEND;TZID=${TIME_ZONE}:${toIcsLocalTime(event.end)}`]
      : []),
    `SUMMARY:${escapeText(event.title)}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    ...(event.description
      ? [`DESCRIPTION:${escapeText(event.description)}`]
      : []),
    ...(event.signupUrl ? [`URL:${event.signupUrl}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function icsFileName(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "event"}.ics`;
}
