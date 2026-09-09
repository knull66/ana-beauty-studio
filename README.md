# Ana Beauty Studio

Public studio site and private dashboard. Next.js App Router, Tailwind CSS, and Supabase.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `ADMIN_EMAIL`.
3. In Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/rls-admin.sql`.
4. Create the studio admin user in Authentication → Users.
5. Under Authentication → Providers → Email, you can disable “Confirm email” so clients can enter after registering.
6. `npm run dev`

Routes: `/` site, `/login`, `/register`, `/account`, `/admin`.
