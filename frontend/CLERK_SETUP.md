# Clerk Google OAuth Setup Guide

## Step 1: Create a Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or log in to your account
3. Click **"Create Application"**
4. Enter your application name (e.g., "SimpleResu.me")
5. Select the authentication methods you want (at minimum, enable **Google**)
6. Click **"Create Application"**

## Step 2: Configure Google OAuth

### Option A: Use Clerk's Development Keys (Quick Start)

For development, Clerk provides shared OAuth credentials:

1. In your Clerk Dashboard, go to **User & Authentication** > **Social Connections**
2. Toggle **Google** to enable it
3. That's it! Clerk's development keys work immediately for testing

### Option B: Use Your Own Google OAuth Credentials (Production)

For production or custom branding:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - Add your app name, logo, and support email
   - Add authorized domains
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://your-clerk-domain.clerk.accounts.dev`
   - Authorized redirect URIs: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
7. Copy the **Client ID** and **Client Secret**
8. In Clerk Dashboard, go to **User & Authentication** > **Social Connections**
9. Click **Google** > **Use custom credentials**
10. Paste your Client ID and Client Secret
11. Save changes

## Step 3: Get Your Clerk API Keys

1. In Clerk Dashboard, click **API Keys** in the sidebar
2. Copy your keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 4: Add Keys to Your Project

1. Open `frontend/.env.local`
2. Add your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

## Step 5: Configure Sign-In/Sign-Up Settings

1. In Clerk Dashboard, go to **User & Authentication** > **Email, Phone, Username**
2. Configure which fields are required/optional:
   - Email address (recommended: required)
   - Phone number (optional)
   - Username (optional)
3. Go to **Restrictions** to configure:
   - Allowed email domains
   - Blocked email addresses
   - Sign-up modes (public vs. restricted)

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Click **"Sign In"** or **"Get Started Free"**

4. Try signing in with Google

5. You should see the Clerk sign-in modal with Google OAuth option

## Troubleshooting

### "Invalid publishable key" error
- Verify you copied the full key correctly
- Make sure there are no extra spaces
- Restart your dev server after adding keys

### Google OAuth button not showing
- Check that Google is enabled in Clerk Dashboard
- Clear browser cache and try again
- Check browser console for errors

### "Redirect URI mismatch" error (custom credentials)
- Verify the redirect URI in Google Console matches exactly
- Make sure to include `/v1/oauth_callback` at the end
- Check for http vs https mismatch

### Users can't sign in
- Check that your sign-in methods are properly configured
- Verify email verification settings
- Check Clerk Dashboard > Logs for detailed error messages

## Additional Configuration

### Customize Appearance

You can customize the Clerk components in your code:

```tsx
<SignIn
  appearance={{
    elements: {
      rootBox: 'mx-auto',
      card: 'shadow-xl border',
      headerTitle: 'text-2xl',
      socialButtonsBlockButton: 'border-2 hover:bg-slate-50',
    },
  }}
/>
```

### Add More OAuth Providers

In Clerk Dashboard > Social Connections, you can also enable:
- GitHub
- LinkedIn
- Microsoft
- Facebook
- Twitter/X
- And many more...

## Security Best Practices

1. Never commit `.env.local` to git
2. Use different keys for development and production
3. Rotate your secret keys regularly
4. Enable multi-factor authentication in production
5. Configure webhook endpoints for important events
6. Set up proper CORS policies

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
