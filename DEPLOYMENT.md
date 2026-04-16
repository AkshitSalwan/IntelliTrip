# IntelliTrip Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, ensure you've completed these steps:

### 1. Code Quality
- [ ] Run `pnpm lint` to check for linting errors
- [ ] Run `pnpm build` to ensure the build succeeds
- [ ] Test all major features locally (sign up, create trip, add expenses, upload photos)
- [ ] Test with different browsers (Chrome, Firefox, Safari)

### 2. Environment Variables
- [ ] All sensitive keys are in `.env.local` and NOT in git
- [ ] `.env.local` is listed in `.gitignore`
- [ ] You have documented all required env vars in `.env.example`

### 3. Database
- [ ] MongoDB Atlas cluster is configured and running
- [ ] Connection string is correct
- [ ] Database backups are enabled (in MongoDB Atlas)
- [ ] IP whitelist includes production server(s)

### 4. Authentication
- [ ] Clerk application is created
- [ ] Clerk API keys are secure
- [ ] Webhook endpoint is configured (for production URL)
- [ ] All sign-in/sign-up redirects are correct

### 5. Security
- [ ] No API keys or secrets are hardcoded in the app
- [ ] All API routes check for authentication
- [ ] CORS is properly configured if needed
- [ ] Rate limiting is considered for API routes

## Deploying to Vercel

### Step 1: Connect GitHub Repository

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"

### Step 2: Configure Environment Variables

In Vercel dashboard:

1. Go to Settings > Environment Variables
2. Add all variables from `.env.local`:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - Any other env vars your app needs

3. Select which environments these apply to (Production, Preview, Development)
4. Save

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your app
3. Wait for deployment to complete (usually 2-5 minutes)
4. You'll get a preview URL

### Step 4: Update Clerk

1. Go to Clerk Dashboard
2. Go to Settings > API & Keys
3. Update allowed redirect URIs:
   - Add: `https://yourdomain.vercel.app`
   - Add: `https://yourdomain.vercel.app/sign-in`
   - Add: `https://yourdomain.vercel.app/sign-up`

4. Go to Webhooks
5. Update webhook endpoint:
   - Old: `http://localhost:3000/api/webhooks/clerk`
   - New: `https://yourdomain.vercel.app/api/webhooks/clerk`

### Step 5: Test Deployment

1. Visit your deployed URL
2. Sign up with a test account
3. Create a trip
4. Test all features (budget, memories, chat)
5. Check browser console for any errors

### Step 6: Set Up Custom Domain (Optional)

1. In Vercel Dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update Clerk with your custom domain

## Monitoring & Maintenance

### Analytics
- Enable Vercel Analytics to monitor performance
- Set up error tracking (Sentry, LogRocket, etc.)

### Database Backups
- MongoDB Atlas automatically backs up data
- Configure backup retention policy
- Test restore procedure periodically

### Monitoring
- Set up error alerts for API failures
- Monitor database performance
- Watch file storage usage (Cloudinary)

### Updates
- Keep dependencies updated with `pnpm update`
- Review security advisories regularly
- Test updates in a staging environment first

## Scaling Considerations

### Database
- MongoDB Atlas M0 (free) suitable for < 100K documents
- Upgrade to M2+ if experiencing performance issues
- Enable auto-scaling for growing databases

### Cloudinary Storage
- Cloudinary pricing is based on storage, transformations, and bandwidth
- Consider CDN delivery for frequently accessed images
- Implement image optimization/compression

### API Routes
- Vercel Serverless Functions have 10-60s timeout
- For long-running tasks, consider background jobs
- Implement request queuing for high traffic

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility
- Check for hardcoded localhost URLs

### Webhook Not Working
- Verify webhook secret is correct
- Check webhook logs in Clerk dashboard
- Ensure endpoint URL is publicly accessible
- Check firewall/security rules

### Database Connection Issues
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database is running
- Check network connectivity from Vercel

### Image Upload Fails
- Verify Cloudinary environment variables are set
- Check file size limits
- Ensure proper permissions for Cloudinary uploads
- Check browser console for errors

## Production Checklist

Before going live:

- [ ] All environment variables are secure
- [ ] Error logging is configured
- [ ] Monitoring/alerts are set up
- [ ] Database backups are working
- [ ] Performance is acceptable
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain is configured
- [ ] Team has access to Vercel dashboard
- [ ] Incident response plan is ready
- [ ] User communication plan is ready

## Support & Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Clerk Documentation: https://clerk.com/docs
- Cloudinary Documentation: https://cloudinary.com/documentation

---

For questions or issues, reach out to your team or check the troubleshooting section above.
