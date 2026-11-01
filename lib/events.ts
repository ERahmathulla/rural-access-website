// The single definition of "upcoming", shared by the website query, the
// Studio's Upcoming/Past lists, and the browser check that hides events on a
// page cached before they ended.

export const NO_END_GRACE_HOURS = 2;

const NO_END_GRACE_SECONDS = NO_END_GRACE_HOURS * 60 * 60;

export function upcomingFilter(now: string) {
  return `coalesce(dateTime(end), dateTime(start) + ${NO_END_GRACE_SECONDS}) >= dateTime(${now})`;
}

export function eventVisibleUntil(start: string, end?: string) {
  return end
    ? new Date(end).getTime()
    : new Date(start).getTime() + NO_END_GRACE_SECONDS * 1000;
}
