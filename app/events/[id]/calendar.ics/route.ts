import { getCalendarEvent } from "@/lib/content";
import { buildIcs, icsFileName } from "@/lib/ics";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/events/[id]/calendar.ics">,
) {
  const { id } = await params;
  const event = await getCalendarEvent(id);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${icsFileName(event.title)}"`,
    },
  });
}
