import { createImageUrlBuilder } from "@sanity/image-url";

import type { Officer } from "@/lib/types";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Sanity's CDN crops, resizes, and converts the photo, so these skip next/image's
// optimizer. They render at 160px; 320px keeps them sharp on high-density phones.
export function officerPhotoUrl(photo: NonNullable<Officer["photo"]>) {
  return builder
    .image(photo)
    .width(320)
    .height(320)
    .fit("crop")
    .auto("format")
    .url();
}
