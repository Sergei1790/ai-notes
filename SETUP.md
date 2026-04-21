# AI Notes — Setup Guide

## 1. Create project
Start with the project setup. Run this in d:\Work\Projects\ELROMCO\Training:


npx create-next-app@latest ai-notes
Settings to pick:
```bash
npx create-next-app@latest ai-notes 
cd ai-notes
```

TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: No (just hit Enter for default)

## 2. Install dependencies

```bash
npm install next-auth@beta prisma @prisma/client @prisma/adapter-pg pg @hookform/resolvers react-hook-form zod
npm install --save-dev dotenv @types/pg
npx prisma init --datasource-provider postgresql
npm install @anthropic-ai/sdk
```
npx prisma init creates `prisma/schema.prisma` and `prisma.config.ts`.

(next-auth@beta — authentication (login, sessions, OAuth)
prisma — CLI tool that generates DB client and runs migrations
@prisma/client — the actual client your code imports to query the DB
@prisma/adapter-pg — connects Prisma to PostgreSQL using the pg driver
pg — raw PostgreSQL driver (Node.js talks to Postgres through this)
@hookform/resolvers react-hook-form — form state management + validation in React
zod — schema validation library (validates data shape — forms, API inputs)
dotenv — loads .env file into process.env
@types/pg — TypeScript types for the pg package
@anthropic-ai/sdk — official SDK to call Claude API from your code)

## 3. Database schema

## Step 3 — Create the database

- Go to neon.tech, create a new project
- Copy the connection string

Create `.env` in the project root (maybe existing by prisma init - created it):

GitHub OAuth app: github.com → Settings → Developer settings → OAuth Apps
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

(google console -> api and services -> OAuth 2.0 Client IDs ->http://localhost:3000 http://localhost:3000/api/auth/callback/google)
```
DATABASE_URL="your_neon_connection_string"
AUTH_SECRET="generate below"
AUTH_GITHUB_ID="from github oauth app" 
AUTH_GITHUB_SECRET="from github oauth app"
AUTH_GOOGLE_ID="from google cloud console"
AUTH_GOOGLE_SECRET="from google cloud console"

```
DATABASE_URL="postgresql://..."
```
Generate AUTH_SECRET:
```bash
npx auth secret
```
## Step 4 — Configure Prisma (prisma.config.ts)

Already generated correctly by Prisma. Should look like:
```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

---

## Step 5 — Write the schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id      String  @id @default(cuid())
  email   String  @unique
  name    String?
  image   String?
  notes   Note[]
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  summary   String?
  tags      String?
}
```

Then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```
## Step 6 — Create Prisma client (src/lib/prisma.ts)

```ts
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export { prisma };
```


## 7. Auth setup

Create `src/auth.ts`:

```ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, image: user.image },
        create: { email: user.email, name: user.name, image: user.image },
      });
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) session.user.id = dbUser.id;
      }
      return session;
    },
  },
});
```

Create `src/app/api/auth/[...nextauth]/route.ts`:

```route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

Create `src/lib/prisma.ts` (Prisma 7 requires adapter):




## Step 11 — Middleware (src/proxy.ts)

```ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    if (!req.auth) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }
});

export const config = {
    matcher: ['/((?!api/auth|signin|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 6. Deploy to Vercel

### First deploy

2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Go to vercel.com → Add New → Project → Import Git Repository
4. Select your repo → before deploying add Environment Variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
5. Click Deploy

### Add production OAuth callback

Go to GitHub → Settings → Developer settings → OAuth Apps → your app:
- Homepage URL: `https://your-app.vercel.app`
- Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

### Push updates after first deploy

```bash
git add .
git commit -m "your message"
git push
```

Vercel auto-redeploys on every push to main.