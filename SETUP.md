# Switching Fin2edge to Supabase Auth

## 1. Create your Supabase project
supabase.com → New project. Grab three values from **Settings → API**:
- Project URL
- `anon` `public` key
- `service_role` key (server-only — never expose this to the browser)

## 2. Run the SQL migration
Open **SQL Editor** in your Supabase dashboard and run `sql/001_profiles_and_auth.sql`.
This creates the `profiles` table (linked to Supabase's built-in `auth.users`),
turns on Row Level Security so users can only read/edit their own row, and adds
a trigger that auto-creates a profile row from the sign-up metadata.

By default Supabase requires email confirmation before a session is issued.
For a demo/dev project you can turn this off at **Authentication → Providers →
Email → Confirm email**, so `registerUser()` gets a session immediately like
the old flow did.

## 3. Drop in these files
```
src/config/supabaseClient.js   → fill in SUPABASE_URL / SUPABASE_ANON_KEY
src/config/supabaseAdmin.js    → new, server-side only
src/services/auth/authService.js → replaces your current one
middleware/requireAuth.js      → replaces your current one
```

## 4. Update .env
```
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
(`SUPABASE_ANON_KEY` doesn't go in `.env` — it's not a secret, it's hardcoded
directly in `supabaseClient.js` since that file runs in the browser.)

## 5. Update server.mjs
Remove these two lines — the frontend now talks to Supabase directly for
auth and profile data, so the Express routes are redundant:
```js
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
...
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
```
Keep everything else (the `/api/assistant` Gemini proxy doesn't need auth
changes). If you add other endpoints later that need to know who's calling
(e.g. saving simulator progress), protect them with the new `requireAuth`
and read `req.user.id`.

## 6. Files you can delete
Nothing else in the project imports these, so they're safe to remove:
- `db.js`
- `routes/auth.js`
- `routes/profile.js`
- `data.db`

And in `package.json`, `bcryptjs` and `jsonwebtoken` are no longer used
anywhere (auth is fully handled by Supabase now) — remove them once you've
confirmed the app runs. `better-sqlite3` and Prisma stay if you want Postgres
for other data later (see the earlier message about pointing Prisma at
Supabase's connection string) — they're unrelated to auth now.

## What didn't change
`authPortalController.js`, `userService.js`, and everything else that calls
`registerUser`, `loginUser`, `fetchCurrentUser`, `updateProfile`,
`logoutUser`, `isLoggedIn`, `getCurrentUser` — the new `authService.js`
returns the exact same shape (`{ id, full_name, email, created_at, profile }`)
so none of that code needs to change.