# Quick Start Guide

Get SimpleResu.me running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Clerk account (free)
- A Supabase account (free)

## Step 1: Clone and Install

```bash
# Navigate to your project
cd simpleresu.me

# Install all dependencies
npm run install:all
```

## Step 2: Get Your API Keys

### Clerk (for Google OAuth)

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Enable Google OAuth:
   - Go to **Social Connections** → Enable **Google**
4. Copy your API keys from **API Keys** section

### Supabase (for database)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** → **API**
4. Copy your Project URL and API keys

## Step 3: Configure Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
# From Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# From Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## Step 4: Run the App

```bash
# From the root directory
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## What You Get

- **Landing Page** (`/`) - Public homepage with sign-in
- **Resume Builder** (`/builder`) - Protected, requires login
- **Job Tracker** (`/job-tracker`) - Protected, requires login

## Testing Authentication

1. Click "Sign In" on the landing page
2. Click "Continue with Google"
3. Authenticate with your Google account
4. You'll be redirected back to the app, now logged in!

## Next Steps

- Customize the landing page
- Add more OAuth providers in Clerk
- Set up Supabase database tables
- Deploy to Vercel

## Need Help?

- Detailed setup: See [SETUP.md](./SETUP.md)
- Clerk configuration: See [frontend/CLERK_SETUP.md](./frontend/CLERK_SETUP.md)
- Issues: Check the console for error messages

## Common Issues

**"Invalid publishable key"**
- Make sure you copied the full key
- Restart the dev server after adding keys

**Google OAuth not showing**
- Enable Google in Clerk Dashboard → Social Connections
- Try clearing browser cache

**Port already in use**
- Next.js will automatically try the next available port
- Or kill the process using the port
