# BRUR QB

BRUR QB is a student-focused question-paper library for Begum Rokeya University, Rangpur. It uses React + Vite, Node.js + Express, PostgreSQL, and S3-compatible object storage.

## Included

- BRUR QB landing page using the supplied BRUR campus photograph
- Responsive question-paper search, filters and pagination
- Question preview, download, report and admin moderation flows
- Browser-persistent saved papers and AI chat history
- Same-origin API defaults (no production localhost API fallback)
- PostgreSQL connection pooling, concurrent count/list queries and cached filter metadata
- Additive database indexes for public question listing
- SEO title/description, canonical, Open Graph, Twitter metadata, WebSite JSON-LD, sitemap and robots.txt
- Health/readiness endpoints and security middleware

## Requirements

- Node.js 20.19+ (Node 22 LTS recommended)
- PostgreSQL
- S3-compatible object storage configured for question files

## Local setup

1. Install backend dependencies:

   ```bash
   npm install
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend && npm install && cd ..
   ```

3. Copy `.env.example` to `.env` and fill in real values. Never commit `.env`.

4. Run database migrations:

   ```bash
   npm run db:migrate
   ```

   Migrations are additive and do not delete question records. Back up the production database before running migrations.

5. Start the application:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Production deployment (single Render Web Service)

Use the repository root as the service root.

- Build command: `npm install && cd frontend && npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Set these environment variables in the hosting dashboard (do not put secret values in source control):

| Variable | Required | Purpose |
|---|---:|---|
| `NODE_ENV` | Yes | Set to `production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ELASTICLAKE_ENDPOINT` | Yes | S3-compatible storage endpoint |
| `ELASTICLAKE_ACCESS_KEY` | Yes | Storage access key |
| `ELASTICLAKE_SECRET_KEY` | Yes | Storage secret |
| `ELASTICLAKE_BUCKET` | Yes | Storage bucket |
| `ADMIN_PASSWORD` | Yes for admin | Strong, unique admin password |
| `ADMIN_JWT_SECRET` | Yes for admin | Random secret of at least 32 characters |
| `FRONTEND_URL` | Recommended | `https://uni-bank-1.onrender.com` |
| `DB_POOL_MAX` | Optional | PostgreSQL pool size; default 10 |

After the service is created and its environment variables are set, run migrations once against the production database:

```bash
npm run db:migrate
```

Do not run the migration command until the database backup is available. The application does not automatically mutate the database on startup.

## Persistence notes

- Question metadata is stored in PostgreSQL.
- Uploaded paper files are stored in the configured S3-compatible bucket, not the server's temporary filesystem.
- Saved question IDs and AI chat history are stored in the visitor's browser local storage. Clearing browser data removes those local-only items.
- Admin login sessions are stored in browser local storage and expire after 12 hours.

## SEO notes

The current canonical host is `https://uni-bank-1.onrender.com`. If a custom domain is connected later, update canonical/social/schema/sitemap URLs and configure a permanent redirect from the old host. Search ranking for “BRUR QB” cannot be guaranteed by code; Google controls indexing and ranking.

The current React/Vite application is client-rendered. Metadata and the initial brand information are present in the HTML, but individual dynamic question pages are not yet server-rendered. A future SSR/prerendering phase can improve crawlability of individual paper records.

## Validation

Run:

```bash
npm test
npm run build
```

Before public launch, verify `/api/ready`, `/api/storage/health`, `/robots.txt`, `/sitemap.xml`, question upload, preview, download, pagination, reporting and admin moderation on the deployed service.
