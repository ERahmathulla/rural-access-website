export function MembershipRequirements({
  requirements,
}: {
  requirements?: string[];
}) {
  if (!requirements?.length) return null;

  return (
    <div className="card">
      <h3 className="text-2xl">Membership requirements</h3>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-amber">
        {requirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
    </div>
  );
}
