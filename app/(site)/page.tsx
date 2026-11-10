import Image from "next/image";
import Link from "next/link";

import { JoinButton } from "@/components/join-button";
import { MembershipRequirements } from "@/components/membership-requirements";
import { OfficerCard } from "@/components/officer-card";
import { getOfficers, getSiteSettings } from "@/lib/content";
import {
  ABOUT_TEXT,
  BRANCHES,
  MEMBER_PATHWAY,
  MISSION_TEXT,
  PUBLIC_EVENTS_NOTE,
} from "@/lib/home-copy";
import { FULL_NAME, SITE_NAME } from "@/lib/site";

// Render on every request so each visitor sees current Sanity content.
export const instant = false;

export default async function HomePage() {
  const [settings, officers] = await Promise.all([
    getSiteSettings(),
    getOfficers(),
  ]);

  return (
    <>
      <section
        id="about"
        className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-8 md:py-14 lg:grid-cols-2 lg:gap-12"
      >
        <Image
          src="/rural-access-logo.png"
          alt="Rural ACCESS logo: a brain with the words Rural ACCESS, surrounded by a circle of people holding hands"
          width={800}
          height={800}
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 420px, 88vw"
          loading="eager"
          fetchPriority="high"
          className="logo-blend mx-auto w-full max-w-[420px] lg:max-w-[520px]"
        />
        <div>
          <h1 className="text-5xl md:text-6xl">{SITE_NAME}</h1>
          <p className="mt-3 text-xl font-bold md:text-2xl">{FULL_NAME}</p>
          <h2 className="mt-8 text-2xl">About Us</h2>
          <p className="mt-2">{ABOUT_TEXT}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#get-involved" className="btn btn-primary">
              Get involved
            </a>
            <Link href="/get-involved" className="btn btn-secondary">
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

      <section id="mission" className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <h2 className="section-heading">Our Mission</h2>
          <p className="mt-6 max-w-3xl">{MISSION_TEXT}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {BRANCHES.map(({ title, text }) => (
              <article key={title} className="card">
                <h3 className="text-2xl">{title}</h3>
                <p className="mt-2">{text}</p>
              </article>
            ))}
          </div>

          <h3 className="mt-12 text-2xl">The member pathway</h3>
          <ol className="mt-5 grid gap-5 md:grid-cols-3">
            {MEMBER_PATHWAY.map(({ title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold font-heading text-xl font-semibold text-ink"
                >
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xl">{title}</h4>
                  <p className="mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {officers.length > 0 && (
        <section id="eboard">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
            <h2 className="section-heading">Meet the E-Board</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {officers.map((officer) => (
                <li key={officer._id}>
                  <OfficerCard officer={officer} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        id="get-involved"
        className={officers.length > 0 ? "bg-sand" : undefined}
      >
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <h2 className="section-heading">How to Get Involved</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
            <MembershipRequirements
              requirements={settings?.membershipRequirements}
            />
            <div>
              <p>{PUBLIC_EVENTS_NOTE}</p>
              <div className="mt-6 flex flex-col items-stretch gap-4 sm:items-start">
                <Link
                  href="/get-involved"
                  className="btn btn-primary btn-prominent"
                >
                  See events &amp; how to volunteer
                </Link>
                <JoinButton joinUrl={settings?.joinUrl} variant="secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
