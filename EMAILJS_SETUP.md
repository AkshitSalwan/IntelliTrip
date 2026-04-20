# Feature Suggestions - Backend Setup

The feature suggestion system is now fully functional with a simple backend API approach! No external email service configuration is required.

## How It Works

Feature suggestions are submitted through a form and stored in your backend via the `/api/feature-suggestion` endpoint. This approach has several advantages:

✅ **Zero Configuration** - Works immediately without external API keys  
✅ **Free Tier** - No cost, no limits  
✅ **Flexible** - Easy to add email notifications later  
✅ **Privacy-Friendly** - Suggestions stay in your database  

## Submitting Suggestions

Users can access the feature suggestion dialog from the **Tools** section:

1. Navigate to **Dashboard → Tools**
2. Scroll to "More Tools Coming Soon"
3. Click **Suggest a Feature**
4. Fill out the form and submit

## Storing Suggestions in MongoDB

To persist suggestions to your MongoDB database, update [app/api/feature-suggestion/route.ts](app/api/feature-suggestion/route.ts) and uncomment the MongoDB storage section.

First, create a MongoDB model:

```typescript
// lib/models/feature-suggestion.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IFeatureSuggestion extends Document {
  name: string
  email: string
  feature: string
  description: string
  submittedAt: Date
}

const FeatureSuggestionSchema = new Schema<IFeatureSuggestion>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    feature: { type: String, required: true },
    description: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const FeatureSuggestion = mongoose.models.FeatureSuggestion || 
  mongoose.model('FeatureSuggestion', FeatureSuggestionSchema)
```

Then in your API route, use it for storage.

## Optional: Adding Email Notifications Later

If you want to send email notifications when suggestions are received, you can integrate:

- **Resend** - Modern email API (free tier: 100 emails/day)
- **SendGrid** - Industry standard (free tier: 100 emails/day)
- **Mailgun** - Reliable (free tier: 5,000 emails/month)
- **Gmail SMTP** - Using your personal Gmail account

### To Add Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install: `pnpm add resend`
4. Update your backend API to send emails via Resend

## Current Features

✅ Form validation (name, email, feature title, description)  
✅ Email format validation  
✅ Error handling with user feedback  
✅ Success notifications  
✅ Form auto-clearing after submission  

## API Endpoint

**POST** `/api/feature-suggestion`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "feature": "Feature Title",
  "description": "Detailed feature description"
}
```

Responses:
- `201` - Suggestion submitted successfully
- `400` - Validation error (missing fields or invalid email)
- `500` - Server error

That's it! Your feature suggestion system is ready to use. 🎉

