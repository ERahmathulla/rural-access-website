# Rural ACCESS website

The website for Rural ACCESS (Alzheimer's & Cognitive Care Education Serving Seniors), a student organization at Florida State University. It has two pages: Home, and Events & Get Involved. It is built with Next.js and Sanity.

## Local setup

You need Node.js 22.12 or newer. On Windows PowerShell, use `npm.cmd` as shown here.

```powershell
npm.cmd install
npm.cmd run dev
```

Then open http://localhost:3000.

## Where content is edited

Officers edit events, the e-board, volunteer opportunities, and site settings at `/studio` on the live site. [docs/EDITING.md](docs/EDITING.md) is their guide.

The About text, mission, branches, member pathway, and public-events note are not in the Studio. They live in code, in [lib/home-copy.ts](lib/home-copy.ts).

## Deploying

Every push to `main` deploys through Vercel. Content changes made in the Studio don't need a deploy; they appear on the site within about two minutes.

The Studio only works from addresses listed under CORS origins for the project at [sanity.io/manage](https://www.sanity.io/manage). Each address needs "Allow credentials" turned on. If the site's address changes, add the new one there.

## Starting content

`scripts/seed.mjs` creates the starting site settings and volunteer opportunities, using your Sanity CLI login (`npx.cmd sanity login`). It writes them to `scripts/seed.ndjson`, imports that file, and prints the document counts.

```powershell
npm.cmd run seed                # adds anything missing and leaves the rest alone
npm.cmd run seed -- --replace   # resets these documents, overwriting Studio edits
```

## Notes for developers

- Sanity reads live in [lib/content.ts](lib/content.ts). Pages that show Sanity content render on every request (`instant = false`), with no Next.js cache, so each visitor sees current content. Sanity requests use `cache: "no-store"` on purpose: without it, Next's fetch cache keeps responses for 15 minutes and across deployments.
- `lib/events.ts` holds the one definition of "upcoming". The website query, the Studio's Upcoming and Past lists, and the browser check that hides events on an older cached page all use it.
- Sanity document IDs must not contain dots. Sanity hides dotted IDs from public visitors.
- The site's CSS loads from `components/site-shell.tsx`, not the root layout, to keep Tailwind's resets out of the Studio.
