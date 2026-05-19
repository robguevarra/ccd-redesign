# Supabase email templates

This folder holds branded HTML for the Supabase Auth emails. They're not
loaded by the app — they must be pasted into the Supabase Dashboard:

1. Visit https://supabase.com/dashboard/project/qxicorwwknphfzvyjngz/auth/templates
2. Pick the relevant template (e.g. "Reset Password")
3. Replace the body with the contents of the matching `.html` file here
4. Save

Templates available:

- `password-reset.html` — used when a user clicks "Forgot your password?" on /admin/login

After updating, send yourself a real reset email from /admin/forgot-password
to verify the rendered output.
