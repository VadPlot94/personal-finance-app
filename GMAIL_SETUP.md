# Gmail & GitHub OAuth Setup Guide

This guide explains how to set up automatic Gmail and GitHub registration/login for the Personal Finance App.

## What was changed

1. **Added Google provider** to `src/lib/auth.ts`
2. **Added GitHub provider** to `src/lib/auth.ts`
3. **Added OAuth buttons** to login form (`src/front-end/components/login/login-form.tsx`)
   - Sign in with Gmail / GitHub
   - Register with Gmail / GitHub
4. Database schema already supports OAuth (Account, Session models are configured)

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click **Create**

5. Copy the **Client ID** and **Client Secret**

### 2. Create GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: Personal Finance App (or any name)
   - **Homepage URL**: `http://localhost:3000` (for local) or your production URL
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (for local) or your production URL
   - Click **Create OAuth App**

4. You'll see **Client ID** and can generate a **Client Secret** (click "Generate a new client secret")

### 3. Add Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### 4. Test the Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Try the OAuth buttons:
   - **"Sign in with Gmail"** / **"Register with Gmail"**
   - **"Sign in with GitHub"** / **"Register with GitHub"**

4. Complete the OAuth flow

5. You should be automatically logged in and redirected to `/overview`

## How It Works

- **First-time users**: When clicking OAuth buttons, a new account is created with their OAuth provider email and name
- **Existing users**: Can link their OAuth accounts to their existing account (if `allowDangerousEmailAccountLinking` is enabled)
- **Session management**: NextAuth handles JWT tokens and session management automatically
- **User data**: Email and name from OAuth providers are automatically populated in the User model

## Troubleshooting

### Redirect URI mismatch error
- Make sure the callback URL exactly matches in your OAuth provider settings:
  - **Google**: `http://localhost:3000/api/auth/callback/google`
  - **GitHub**: `http://localhost:3000/api/auth/callback/github`
- For production, replace `localhost:3000` with your actual domain

### Environment variables not loading
- Restart your dev server after adding `.env.local`
- Ensure `.env.local` is in the root directory of the project

### User creation fails
- Check that your database connection is working
- Run `npm run prisma:push` to ensure Account model is migrated

## Additional Resources

- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [NextAuth.js GitHub Provider Docs](https://next-auth.js.org/providers/github)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
