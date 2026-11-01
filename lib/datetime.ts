export const TIME_ZONE = "America/New_York";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const partsFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${dateFormat.format(date)}, ${timeFormat.format(date)} ET`;
}

export function formatDateRange(start: string, end?: string) {
  const startDate = new Date(start);
  if (!end) return formatDateTime(start);

  const endDate = new Date(end);
  const sameDay = dateFormat.format(startDate) === dateFormat.format(endDate);
  if (sameDay) {
    return `${dateFormat.format(startDate)}, ${timeFormat.format(startDate)} – ${timeFormat.format(endDate)} ET`;
  }
  return `${dateFormat.format(startDate)}, ${timeFormat.format(startDate)} – ${dateFormat.format(endDate)}, ${timeFormat.format(endDate)} ET`;
}

// Local New York wall-clock time in iCalendar form, e.g. 20261105T180000.
export function toIcsLocalTime(iso: string) {
  const parts = Object.fromEntries(
    partsFormat
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
}

// UTC time in iCalendar form, e.g. 20261105T220000Z.
export function toIcsUtcTime(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}
