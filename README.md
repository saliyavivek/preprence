# Preprence

Preprence is a student interview-experience platform for browsing and sharing real interview experiences from the college community.

Built with Next.js, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL, and Prisma.

## Setup

Requirements: Node.js 22+, pnpm, PostgreSQL, and a Supabase project with email magic-link authentication enabled.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env` in the project root:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
   COLLEGE_EMAIL_DOMAIN=ldce.ac.in
   ```

3. Generate Prisma Client and apply migrations:

   ```bash
   pnpm prisma generate
   pnpm prisma migrate deploy
   ```

4. Seed the company directory if needed:

   ```bash
   pnpm prisma db seed
   ```

5. Start the app:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                               | Purpose                               |
| -------------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Site URL used for auth callbacks.     |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL.                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key.             |
| `DATABASE_URL`                         | PostgreSQL connection used by Prisma. |
| `COLLEGE_EMAIL_DOMAIN`                 | Allowed college email domain.         |

The app reads `DATABASE_URL` directly. `DIRECT_URL` is not currently used by the runtime. For Supabase, use the transaction pooler on port `6543` with `?pgbouncer=true`, or a reachable session/direct connection on port `5432`.

Configure `<site-url>/auth/callback` as a Supabase redirect URL. Never commit database passwords or private credentials.

## Routes

| Route                                 | Purpose                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| `/`                                   | Landing page with popular companies and recent experiences. |
| `/login`                              | College-email magic-link login.                             |
| `/companies`                          | Company directory.                                          |
| `/companies/[slug]`                   | Experiences for a company.                                  |
| `/experiences`                        | Published experience directory.                             |
| `/experiences/[id]`                   | Experience details.                                         |
| `/dashboard`                          | User dashboard.                                             |
| `/dashboard/experiences`              | Manage submitted experiences.                               |
| `/experience/new`                     | Start a new experience.                                     |
| `/experience/[id]/edit`               | Add rounds and publish an experience.                       |
| `/admin/experiences`                  | Admin moderation dashboard.                                 |
| `/admin/experiences/[id]`             | Review or take down an experience.                          |
| `GET /api/companies/search?q=<query>` | Search companies with published experiences.                |

## Database Commands

```bash
pnpm prisma migrate dev --name describe-change
pnpm prisma migrate deploy
pnpm prisma generate
pnpm prisma studio
```

The Prisma schema is in `prisma/schema.prisma`. Migrations are in `prisma/migrations`.

## Scripts

| Command      | Purpose                                   |
| ------------ | ----------------------------------------- |
| `pnpm dev`   | Start development server.                 |
| `pnpm build` | Generate Prisma Client and build the app. |
| `pnpm start` | Start the production server.              |
| `pnpm lint`  | Run ESLint.                               |

## Deployment

For Vercel:

1. Add all environment variables to the Vercel project.
2. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
3. Add the deployed URL and `/auth/callback` to Supabase redirect settings.
4. Deploy with `pnpm build`.

## Troubleshooting

### `P1001: Can't reach database server`

Check that:

- `DATABASE_URL` is configured in Vercel.
- The Supabase host, port, password, and project reference are correct.
- Port `6543` uses `?pgbouncer=true`.
- The database allows connections from the deployment environment.
- You redeployed after changing environment variables.

The login page can work while other routes fail because most other pages query PostgreSQL during server rendering.

### Magic-link redirect failure

Check `NEXT_PUBLIC_SITE_URL` and the Supabase allowed redirect URLs.

## Project Structure

```text
app/          Routes, pages, server actions, and API handlers
components/   Reusable UI components
lib/          Prisma, Supabase, auth, and shared utilities
prisma/       Schema, migrations, and seed data
public/       Static assets
proxy.ts      Protected-route session handling
```

See [DESIGN.md](DESIGN.md) for the interface guidelines.
