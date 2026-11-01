import Image from "next/image";

import { officerPhotoUrl } from "@/lib/image";
import type { Officer } from "@/lib/types";
import { OFFICER_ROLES, optionTitle } from "@/sanity/options";

function initials(name: string) {
  const words = name.split(/\s+/).filter((word) => !word.endsWith("."));
  const letters = words.length > 1 ? [words[0], words.at(-1)] : words;
  return letters.map((word) => word?.[0]?.toUpperCase()).join("");
}

export function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <article className="card flex h-full flex-col items-center text-center">
      {officer.photo?.asset ? (
        <Image
          src={officerPhotoUrl(officer.photo)}
          alt={officer.photo.alt || officer.name}
          width={160}
          height={160}
          unoptimized
          className="size-32 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-32 items-center justify-center rounded-full bg-gold font-heading text-4xl font-semibold text-ink"
        >
          {initials(officer.name)}
        </div>
      )}
      <h3 className="mt-4 text-xl">{officer.name}</h3>
      <p className="font-bold">{optionTitle(OFFICER_ROLES, officer.role)}</p>
      {officer.shortBio && <p className="mt-2">{officer.shortBio}</p>}
    </article>
  );
}
