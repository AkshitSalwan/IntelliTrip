# IntelliTrip - AI-Powered Trip Planning App

IntelliTrip is a modern, intelligent trip planning application that uses AI to help you create personalized itineraries, track budgets, manage memories, and collaborate with travel companions.

## Features

### 🗺️ Smart Trip Planning
- **AI Itinerary Generator**: Automatically generate day-by-day itineraries based on your destination, travel style, and interests
- **Flexible Itinerary Editor**: Customize auto-generated itineraries or create from scratch
- **Destination Insights**: Get recommendations and tips for your destinations

### 💰 Budget Management
- **Expense Tracking**: Log all trip expenses with categories (accommodation, food, activities, transport, etc.)
- **Budget Overview**: Visual breakdown of spending with pie and bar charts
- **Per-Day Budgeting**: Track daily spending against your budget

### 📸 Trip Memories
- **Photo Gallery**: Upload and organize photos from your trips
- **Memory Timeline**: Chronological view of your trip memories
- **Cloud Storage**: All photos securely stored with Cloudinary

### 🤖 AI Travel Assistant
- **Trip Chat**: Ask questions and get travel advice tailored to your specific trip
- **Real-time Assistance**: Get instant help planning activities, finding restaurants, or solving travel issues
- **Context-Aware**: The AI understands your trip details (destination, dates, budget, travel style)

### 👥 Collaborative Planning
- **Share Trips**: Invite friends and family to collaborate
- **Shared Editing**: Everyone can contribute to itineraries and expenses
- **Team Communication**: Built-in chat for trip coordination

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **AI**: Google Gemini via the Vercel AI SDK
- **File Storage**: Cloudinary
- **Charts**: Recharts
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB Atlas account (free tier works)
- Clerk account (for authentication)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intellitrip
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** in `.env.local`:

   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@your-cluster-host.mongodb.net/intellitrip

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Clerk Webhooks (for user sync)
   CLERK_WEBHOOK_SECRET=your_webhook_secret

   # Cloudinary (for trip memory storage)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # AI Features (optional - uses Gemini by default)
   GEMINI_API_KEY=your_gemini_api_key

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Setting Up Services

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string and add it to `MONGODB_URI`

#### Clerk
1. Go to [Clerk.com](https://clerk.com)
2. Create a new application
3. Get your API keys from the dashboard
4. Set up webhooks:
   - Go to Webhooks in Clerk dashboard
   - Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to `user.created`, `user.updated`, `user.deleted` events

#### Cloudinary (Optional)
1. Create a Cloudinary account and a media upload preset or use signed uploads from the server
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to your environment
3. Trip memories will upload to Cloudinary and their URLs will be stored in MongoDB

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
intellitrip/
├── app/
│   ├── api/                 # API routes
│   │   ├── trips/          # Trip management endpoints
│   │   ├── webhooks/       # Clerk webhook handler
│   │   └── ...
│   ├── dashboard/          # Protected dashboard routes
│   ├── sign-in/            # Clerk sign-in page
│   ├── sign-up/            # Clerk sign-up page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── trip-card.tsx
│   │   ├── trip-form.tsx
│   │   ├── trip-detail-tabs.tsx
│   │   └── tabs/           # Individual tab components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── db.ts               # MongoDB connection
│   ├── models/             # Mongoose models
│   │   ├── user.ts
│   │   └── trip.ts
│   └── services/           # Business logic
│       └── ai-service.ts   # AI functions
├── middleware.ts           # Clerk authentication middleware
├── .env.example            # Environment variables template
└── package.json
```

## Usage

### Creating a Trip
1. Click "Create New Trip" on the dashboard
2. Enter destination, dates, budget, travel style, and interests
3. Generate AI itinerary or create custom itinerary
4. Save and start planning!

### Managing Budget
1. Go to the Budget tab
2. Add expenses with category, amount, and description
3. View spending breakdown with charts
4. Track progress against your budget

### Uploading Memories
1. Go to the Memories tab
2. Click "Add Memory" and upload photos
3. Add dates and captions
4. Create a visual timeline of your trip

### Chat with AI Assistant
1. Go to the Chat tab
2. Ask questions about your trip
3. Get recommendations, planning help, or travel advice
4. Conversation is contextual to your specific trip

## API Endpoints

### Trips
- `GET /api/trips` - Get all trips for current user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

### Expenses
- `POST /api/trips/[id]/expenses` - Add expense
- `DELETE /api/trips/[id]/expenses/[expenseId]` - Delete expense

### Itinerary
- `POST /api/trips/[id]/itinerary` - Generate AI itinerary

### Memories
- `POST /api/trips/[id]/memories` - Upload memory photo
- `DELETE /api/trips/[id]/memories/[memoryId]` - Delete memory

### Chat
- `POST /api/trips/[id]/chat` - Chat with AI assistant

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all variables from your `.env.local`
   - Redeploy

4. **Update Clerk Redirect URIs**
   - In Clerk dashboard, add your Vercel URL to allowed redirect URIs
   - Format: `https://yourdomain.vercel.app`

5. **Update Clerk Webhook**
   - Change webhook endpoint to your Vercel URL
   - Format: `https://yourdomain.vercel.app/api/webhooks/clerk`

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Code Quality
This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## Color Scheme

The app uses a travel-inspired color palette:
- **Primary**: Ocean Blue (200° 100% 45%) - Adventure & exploration
- **Secondary**: Warm Sand/Gold (44° 95% 55%) - Complementary warmth
- **Accent**: Teal/Turquoise (174° 60% 50%) - CTAs & highlights
- **Neutrals**: Clean whites and grays

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the GitHub Issues page
2. Contact support at support@intellitrip.com
3. Visit our documentation site

## Roadmap

- [ ] Real-time collaboration with WebSockets
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers
- [ ] Advanced expense analytics
- [ ] Weather integration
- [ ] Restaurant & activity reservations
- [ ] Travel insurance recommendations
- [ ] Passport & visa status tracking
- [ ] Multi-language support
- [ ] Integration with booking platforms

---

Built with ❤️ for travelers who love planning
