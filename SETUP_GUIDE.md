# IntelliTrip - Quick Setup Guide

Follow these steps to get IntelliTrip up and running locally.

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 free tier is fine)
4. Wait for cluster to be ready
5. Click "Connect" and choose "Drivers"
6. Copy the connection string
7. Replace `<username>`, `<password>`, and `<database>` with your values
8. Note: The connection string should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/intellitrip?retryWrites=true&w=majority
   ```

## Step 3: Set Up Clerk Authentication

1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application
4. Choose your authentication methods (Email + Password recommended)
5. In the left sidebar, go to "API Keys"
6. Copy your "Publishable Key" and "Secret Key"
7. Scroll down to find "Webhook Secret" (if you don't see it, we'll create it in Step 4)

## Step 4: Set Up Clerk Webhook

1. In Clerk dashboard, go to "Webhooks" in the left sidebar
2. Click "Create Endpoint"
3. For now, use: `http://localhost:3000/api/webhooks/clerk`
4. Under "Events to send", enable:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Create the endpoint
6. Copy the "Signing Secret" that appears

## Step 5: Create .env.local File

Create a file named `.env.local` in the root directory with these values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@your-cluster-host.mongodb.net/intellitrip?retryWrites=true&w=majority

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 6: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Step 7: Test the App

1. Click "Sign Up" and create a test account
2. You should be redirected to the dashboard
3. Click "Create New Trip"
4. Fill in trip details and create
5. Explore the dashboard features

## Optional: Set Up Cloudinary (for Photos)

1. Create a Cloudinary account
2. Copy your Cloud name, API key, and API secret into `.env.local`
3. Photos will upload to Cloudinary and the app will store the returned URLs in MongoDB

## Optional: Set Up AI Features

The app uses Google Gemini through the Vercel AI SDK.

Set `GEMINI_API_KEY` in your `.env.local` to enable AI features.

## Troubleshooting

### MongoDB Connection Error
- Check your MongoDB connection string in `.env.local`
- Make sure MongoDB Atlas cluster is running
- Check that your IP is whitelisted in MongoDB (set to 0.0.0.0/0 for development)

### Clerk Authentication Error
- Verify your publishable and secret keys are correct
- Make sure they're in the right environment variables
- Check Clerk dashboard to ensure app is active

### Webhook Not Working
- During development, webhooks from Clerk won't reach localhost
- Set up Clerk on a deployed version (Vercel) for webhooks to work
- Or use Clerk's webhook testing feature in dashboard

## Next Steps

- Read the main [README.md](./README.md) for full documentation
- Explore the dashboard and create trips
- Check out the code structure in `/components` and `/app`
- Deploy to Vercel when ready

## Need Help?

1. Check the main [README.md](./README.md)
2. Read the GitHub Issues
3. Check Clerk documentation: https://clerk.com/docs
4. Check MongoDB documentation: https://docs.mongodb.com
