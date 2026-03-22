# FeeTrack - School Fees Tracker

A complete full-stack application for teachers to manage student fees, track installments, and view class-level collection metrics.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Query v5, Zustand, React Router v6
- **Backend**: Node.js 20, Express 4, Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel (Frontend + Serverless Functions)

## 1. Supabase Project Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the completely generated `supabase_schema.sql` file.
3. Configure Auth policies and grab your project URLs/keys from Settings -> API.

## 2. Local Dev Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install          # root (for concurrently)
   cd client && npm i   # frontend
   cd ../server && npm i # backend
   ```
3. Set Environment Variables:
   - Copy `client/.env.example` to `client/.env` and fill Supabase Anon Key and URL.
   - Copy `server/.env.example` to `server/.env` and fill Supabase Service Role Key, URL, and JWT Secret.
4. Run the Dev Servers:
   ```bash
   npm run dev
   ```
   *This concurrently runs Vite (`http://localhost:5173`) and Express (`http://localhost:3001`).*

## 3. Vercel Deployment
1. Create a new Project on Vercel and link this repository.
2. The `vercel.json` is pre-configured to build the client into `client/dist` and alias Express routes under `api/`.
3. Under Environment Variables in Vercel, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (set to `https://your-vercel-domain.vercel.app/api`)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
4. Deploy!

## 4. Security
- API backend endpoints use JWT verification with user IDs decoded manually from Supabase.
- Express middlewares include `helmet` (HTTP headers), `cors`, and `express-rate-limit`.
- Supabase implements RLS on the database making cross-teacher data leakage impossible on direct connections.
