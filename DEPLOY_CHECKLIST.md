# FeeTrack Deployment Checklist

Make sure to mark these items off before your production launch!

- [ ] **Supabase project created**
  Ensure you have your keys and database setup ready.
- [ ] **Schema SQL executed in Supabase SQL editor**
  All tables, roles, and the `student_fee_summary` view must be present.
- [ ] **RLS policies verified**
  Test with a second user to make sure they cannot see the first user's data. (Bypass disabled for authenticated client-side, protected carefully on server-side).
- [ ] **Environment variables set in Vercel dashboard**
  Ensure you have added all keys needed for both frontend (VITE_*) and server functions.
- [ ] **CORS origin updated to production URL**
  Modify your Node server's CORS or Vercel config.
- [ ] **Supabase Auth email templates customized**
  Set proper branding for email confirmations.
- [ ] **Rate limiting configured for production**
  Express rate limit is enabled via the API, verify reverse proxies don't clip true IPs setup.
- [ ] **Error monitoring set up (Sentry optional)**
  Use the generated `ErrorBoundary.jsx` and plug it into Sentry if you wish for advanced monitoring.
