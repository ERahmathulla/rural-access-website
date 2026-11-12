import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  RESOURCE_PROJECT_URL,
} from "@/lib/site";

const linkStyles = "text-cream hover:text-cream";

export function SiteFooter() {
  return (
    <footer className="bg-garnet text-cream [--focus:var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <ul className="space-y-2">
          <li>
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkStyles}>
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            Instagram:{" "}
            <a href={INSTAGRAM_URL} className={linkStyles}>
              {INSTAGRAM_HANDLE}
            </a>
          </li>
          <li>
            Our community resource project:{" "}
            <a href={RESOURCE_PROJECT_URL} className={linkStyles}>
              Big Bend Brain Health
            </a>
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-sm">
          Rural ACCESS is a Registered Student Organization at Florida State
          University. Registration does not constitute university endorsement,
          support, or concurrence.
        </p>
        <p className="mt-2 max-w-3xl text-sm">
          This site uses Google Analytics to count visits. It doesn&apos;t
          collect your name or email address.
        </p>
      </div>
    </footer>
  );
}
