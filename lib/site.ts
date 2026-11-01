export const SITE_NAME = "Rural ACCESS";
export const FULL_NAME =
  "Alzheimer's & Cognitive Care Education Serving Seniors";
export const SITE_DESCRIPTION =
  "Rural ACCESS is a student organization at Florida State University that helps families in Tallahassee and across the Big Bend connect with dementia care and support.";

export const CONTACT_EMAIL = "ruralaccessatfsu@gmail.com";
export const INSTAGRAM_HANDLE = "@ruralaccessfsu";
export const INSTAGRAM_URL = "https://www.instagram.com/ruralaccessfsu/";
export const RESOURCE_PROJECT_URL = "https://dementia-awareness.vercel.app";
export const JOIN_FALLBACK_URL = `mailto:${CONTACT_EMAIL}?subject=Joining%20Rural%20ACCESS`;

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = productionHost
  ? `https://${productionHost}`
  : "http://localhost:3000";
