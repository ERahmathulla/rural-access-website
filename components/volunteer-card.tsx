import type { VolunteerOpportunity } from "@/lib/types";

const EMAIL_PATTERN = /([\w.+-]+@[\w-]+\.[\w.-]*\w)/;

function withEmailLinks(text: string) {
  return text
    .split(EMAIL_PATTERN)
    .map((part, index) =>
      index % 2 === 1 ? (
        <a key={index} href={`mailto:${part}`}>
          {part}
        </a>
      ) : (
        part
      ),
    );
}

export function VolunteerCard({
  opportunity,
}: {
  opportunity: VolunteerOpportunity;
}) {
  const comingSoon = opportunity.status === "coming-soon";
  const { title, organization, summary, requirements, howToStart, pointsNote } =
    opportunity;

  return (
    <article className="card">
      <span className={`badge ${comingSoon ? "" : "badge-gold"}`}>
        {comingSoon ? "Coming soon" : "Open"}
      </span>
      <h4 className="mt-3 text-2xl">{title}</h4>
      {organization && <p className="font-bold">{organization}</p>}
      {summary && <p className="mt-3">{summary}</p>}

      {comingSoon ? (
        <p className="mt-4 font-bold">Details coming soon</p>
      ) : (
        <>
          {requirements && requirements.length > 0 && (
            <>
              <h5 className="mt-5 text-lg">Requirements</h5>
              <ul className="mt-2 list-disc space-y-2 pl-6 marker:text-amber">
                {requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </>
          )}
          {howToStart && (
            <>
              <h5 className="mt-5 text-lg">How to start</h5>
              <p className="mt-2">{withEmailLinks(howToStart)}</p>
            </>
          )}
          {pointsNote && <p className="badge badge-amber mt-5">{pointsNote}</p>}
        </>
      )}
    </article>
  );
}
