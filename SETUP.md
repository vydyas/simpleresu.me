# SimpleResu.me Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Clerk account ([clerk.com](https://clerk.com))
- A Supabase account ([supabase.com](https://supabase.com))

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select an existing one
3. Enable Google OAuth:
   - Go to **User & Authentication** > **Social Connections**
   - Enable **Google**
   - Follow Clerk's guide to set up Google OAuth credentials
4. Copy your API keys from the **API Keys** section

### 3. Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to **Settings** > **API**
4. Copy your:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

### 4. Set Up Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your actual keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### 5. Run the Development Server

```bash
# From the root directory
npm run dev

# Or run frontend only
npm run dev:frontend
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
simpleresu.me/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page with auth
│   │   ├── builder/
│   │   │   └── page.tsx          # Resume builder (protected)
│   │   └── layout.tsx            # Root layout with ClerkProvider
│   ├── lib/
│   │   └── supabase.ts           # Supabase client
│   └── middleware.ts             # Clerk authentication middleware
└── backend/
    └── src/
        └── server.ts
```

## Features

- Minimalistic landing page
- Google OAuth sign-in via Clerk
- Protected resume builder route
- Supabase integration ready for data storage
- Responsive design with Tailwind CSS

## Next Steps

1. Configure additional OAuth providers in Clerk (GitHub, LinkedIn, etc.)
2. Set up Supabase database tables for storing resume data
3. Implement resume data persistence with Supabase
4. Add user profile management

## Troubleshooting

### "Invalid publishable key" error
- Make sure you copied the correct keys from Clerk dashboard
- Ensure keys start with `pk_test_` and `sk_test_` for test environment

### "Supabase client error"
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active

### Authentication not working
- Clear your browser cache and cookies
- Check that middleware.ts is properly configured
- Verify Clerk webhook settings if using production
