import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import { Suspense } from "react";

import { GoogleAnalytics } from "@/components/google-analytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const headingFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const bodyFont = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const OG_IMAGE_ALT =
  "The Rural ACCESS logo: a brain surrounded by a circle of people holding hands.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: OG_IMAGE_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", alt: OG_IMAGE_ALT }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f1d5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body style={{ margin: 0 }}>
        {children}
        {process.env.VERCEL_ENV === "production" && (
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        )}
      </body>
    </html>
  );
}
