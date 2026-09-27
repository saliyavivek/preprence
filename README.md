# Preprence

Preprence is a student-focused platform for discovering and sharing real interview experiences from the college community. It helps students compare hiring processes, explore companies and roles, and document the details of their own interviews.

## Features

- Browse published interview experiences by company, role, and skill.
- Search the company, role, and skill directory from a global search interface.
- Submit experiences with interview rounds, outcomes, difficulty, and supporting details.
- Manage draft and published experiences from a personal dashboard.
- Authenticate with a college email address using Supabase magic links.
- Provide anonymous experience submissions when appropriate.
- Moderate reports and published experiences through an admin dashboard.

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- PostgreSQL with Prisma ORM 7
- Supabase Auth with server-side session handling
- pnpm for package management

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Supabase
- A Supabase project configured for email magic-link authentication

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
COLLEGE_EMAIL_DOMAIN=ldce.ac.in
```

| Variable                               | Description                                             |
| -------------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Base URL used when creating authentication callbacks.   |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL of the Supabase project.                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public Supabase key used by the application.            |
| `DATABASE_URL`                         | PostgreSQL connection string used by Prisma at runtime. |
| `COLLEGE_EMAIL_DOMAIN`                 | Email domain allowed for user authentication.           |

For Supabase, a transaction pooler connection on port `6543` should include `?pgbouncer=true`. The runtime currently reads `DATABASE_URL` directly; `DIRECT_URL` is not required.

### 3. Configure Supabase

Enable email magic-link authentication in Supabase and add the following redirect URL to the Supabase authentication settings:

```text
http://localhost:3000/auth/callback
```

Use the equivalent URL for each deployed environment. Do not commit `.env` files, database passwords, or private credentials.

### 4. Initialize the database

Generate the Prisma client and apply the existing migrations:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

To populate the company directory with seed data:

```bash
pnpm prisma db seed
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Common Commands

| Command                                 | Description                                           |
| --------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                              | Start the Next.js development server.                 |
| `pnpm build`                            | Generate Prisma Client and create a production build. |
| `pnpm start`                            | Start the production server.                          |
| `pnpm lint`                             | Run ESLint.                                           |
| `pnpm prisma generate`                  | Generate the Prisma Client.                           |
| `pnpm prisma migrate dev --name <name>` | Create and apply a development migration.             |
| `pnpm prisma migrate deploy`            | Apply pending migrations in a deployment environment. |
| `pnpm prisma studio`                    | Open Prisma Studio.                                   |

## Application Routes

| Route                       | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `/`                         | Landing page with featured companies and recent experiences. |
| `/login`                    | College-email magic-link authentication.                     |
| `/companies`                | Browse the company directory.                                |
| `/companies/[slug]`         | View published experiences for a company.                    |
| `/experiences`              | Browse published interview experiences.                      |
| `/experiences/[id]`         | View an individual interview experience.                     |
| `/experiences/role/[slug]`  | Browse experiences by role.                                  |
| `/experiences/skill/[slug]` | Browse experiences by skill.                                 |
| `/dashboard`                | View the authenticated user's dashboard.                     |
| `/dashboard/experiences`    | Manage submitted experiences.                                |
| `/experience/new`           | Create a new interview experience.                           |
| `/experience/[id]/edit`     | Add rounds and publish an experience.                        |
| `/admin/experiences`        | Review and moderate experiences.                             |
| `/admin/experiences/[id]`   | Review an individual experience.                             |

## API

| Method | Endpoint                          | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| `GET`  | `/api/search?q=<query>`           | Search companies, roles, and skills.         |
| `GET`  | `/api/companies/search?q=<query>` | Search companies with published experiences. |

## Database Workflow

The Prisma schema is located at [`prisma/schema.prisma`](prisma/schema.prisma), and migrations are stored in [`prisma/migrations`](prisma/migrations).

For local schema changes, create a named migration:

```bash
pnpm prisma migrate dev --name describe-change
```

Review the generated migration before committing it. Use `pnpm prisma migrate deploy` in shared or production environments.

## Project Structure

```text
app/          Routes, pages, server actions, API handlers, and generated Prisma client
components/   Reusable React components
lib/          Database, authentication, matching, and shared utilities
prisma/       Prisma schema, migrations, and seed script
public/       Static assets
proxy.ts      Protected-route session handling
```

See [`DESIGN.md`](DESIGN.md) for the project's interface guidelines.

## Deployment

Preprence can be deployed to Vercel or another platform that supports Next.js:

1. Provision a PostgreSQL database and configure Supabase Auth.
2. Add all required environment variables to the deployment environment.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed application URL.
4. Add `<deployed-url>/auth/callback` to the Supabase redirect URL allowlist.
5. Run the production build with `pnpm build`.
6. Apply pending database migrations with `pnpm prisma migrate deploy`.

Make sure the deployment can reach the PostgreSQL host. A successful login does not guarantee database connectivity because most application pages query PostgreSQL during server rendering.

## Troubleshooting

### Database connection errors

For `P1001: Can't reach database server` errors, verify the following:

- `DATABASE_URL` is present in the active environment.
- The database host, port, credentials, and project reference are correct.
- Supabase pooler URLs use port `6543` and include `?pgbouncer=true`.
- The database accepts connections from the deployment environment.
- The application was redeployed after changing environment variables.

### Magic-link redirect errors

Confirm that `NEXT_PUBLIC_SITE_URL` matches the current environment and that the corresponding `/auth/callback` URL is present in the Supabase redirect allowlist.

## License

This project is private and is not currently distributed under an open-source license.
