const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const envPaths = ['.env.local', '.env', '.env.example']
  .map((filename) => path.join(__dirname, '..', filename))
  .filter((filepath) => fs.existsSync(filepath));

if (envPaths.length > 0) {
  require('dotenv').config({ path: envPaths[0] });
  console.log(`Loaded environment variables from ${path.basename(envPaths[0])}`);
}

// Connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define schemas
const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ownerId: { type: String, required: false },
  title: { type: String, required: true },
  description: String,
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  travelStyle: {
    type: String,
    enum: ['luxury', 'standard', 'budget', 'adventure'],
    default: 'standard',
  },
  interests: [String],
  members: [
    {
      userId: String,
      name: String,
      email: String,
      role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
      joinedAt: Date,
    },
  ],
  itinerary: [
    {
      id: String,
      day: Number,
      title: String,
      description: String,
      time: String,
      location: String,
      category: String,
    },
  ],
  expenses: [
    {
      id: String,
      description: String,
      amount: Number,
      category: String,
      paidBy: String,
      date: Date,
    },
  ],
  memories: [
    {
      id: String,
      url: String,
      publicId: String,
      caption: String,
      uploadedAt: String,
    },
  ],
  images: [
    {
      url: String,
      uploadedAt: Date,
      uploadedBy: String,
    },
  ],
  status: { type: String, enum: ['planning', 'ongoing', 'completed'], default: 'planning' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const bucketListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['experience', 'destination', 'adventure', 'cultural', 'relaxation'],
    default: 'experience',
  },
  destination: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  completed: { type: Boolean, default: false },
  completedTripId: mongoose.Schema.Types.ObjectId,
  completedDate: Date,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const socialTripSchema = new mongoose.Schema({
  tripId: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true },
  userName: String,
  userAvatar: String,
  title: String,
  description: String,
  destination: String,
  coverImage: String,
  thumbnail: String,
  startDate: Date,
  endDate: Date,
  isPublic: { type: Boolean, default: false },
  likes: [String],
  comments: [
    {
      id: String,
      userName: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const cityImageSchema = new mongoose.Schema({
  city: String,
  country: String,
  images: [
    {
      url: String,
      title: String,
      description: String,
      imageType: {
        type: String,
        enum: ['landmark', 'street', 'park', 'food', 'culture', 'architecture'],
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Create models
const Trip = mongoose.model('Trip', tripSchema);
const BucketListItem = mongoose.model('BucketListItem', bucketListSchema);
const SocialTrip = mongoose.model('SocialTrip', socialTripSchema);
const CityImage = mongoose.model('CityImage', cityImageSchema);

const testUserId = 'user_test_123'; // Default test user

// Sample data
const sampleTrips = [
  {
    userId: testUserId,
    ownerId: testUserId,
    title: 'Paris: City of Romance',
    description: 'An unforgettable 5-day journey through the City of Light, exploring iconic landmarks, world-class museums, and charming cafés.',
    destination: 'Paris, France',
    startDate: new Date('2026-06-15'),
    endDate: new Date('2026-06-20'),
    budget: 2500,
    currency: 'USD',
    travelStyle: 'luxury',
    interests: ['culture', 'museums', 'food', 'art'],
    status: 'completed',
    itinerary: [
      {
        id: '1',
        day: 1,
        title: 'Arrival & Eiffel Tower',
        description: 'Arrive in Paris and visit the iconic Eiffel Tower',
        time: '14:00',
        location: 'Eiffel Tower, Paris',
        category: 'landmark',
      },
      {
        id: '2',
        day: 2,
        title: 'Louvre Museum',
        description: 'Explore the world\'s largest art museum',
        time: '09:00',
        location: 'Louvre Museum',
        category: 'museum',
      },
      {
        id: '3',
        day: 3,
        title: 'Seine River Cruise',
        description: 'Relaxing cruise along the Seine',
        time: '18:00',
        location: 'Seine River',
        category: 'sightseeing',
      },
    ],
    members: [
      {
        userId: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'owner',
        joinedAt: new Date(),
      },
    ],
  },
  {
    userId: testUserId,
    ownerId: testUserId,
    title: 'Tokyo Adventure',
    description: 'Experience the vibrant energy of Tokyo with ancient temples, modern technology, and incredible cuisine.',
    destination: 'Tokyo, Japan',
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-07-07'),
    budget: 1800,
    currency: 'USD',
    travelStyle: 'adventure',
    interests: ['culture', 'food', 'technology', 'temples'],
    status: 'planning',
    itinerary: [
      {
        id: '1',
        day: 1,
        title: 'Arrival & Shibuya',
        description: 'Explore the famous Shibuya Crossing',
        time: '16:00',
        location: 'Shibuya, Tokyo',
        category: 'sightseeing',
      },
      {
        id: '2',
        day: 2,
        title: 'Senso-ji Temple',
        description: 'Visit the oldest temple in Tokyo',
        time: '10:00',
        location: 'Senso-ji Temple',
        category: 'temple',
      },
    ],
    members: [
      {
        userId: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'owner',
        joinedAt: new Date(),
      },
    ],
  },
  {
    userId: testUserId,
    ownerId: testUserId,
    title: 'New York City Explorer',
    description: 'Discover the energy and diversity of the Big Apple with Broadway shows, world-class museums, and amazing food.',
    destination: 'New York City, USA',
    startDate: new Date('2026-08-10'),
    endDate: new Date('2026-08-17'),
    budget: 3000,
    currency: 'USD',
    travelStyle: 'luxury',
    interests: ['theater', 'museums', 'food', 'architecture'],
    status: 'completed',
    itinerary: [
      {
        id: '1',
        day: 1,
        title: 'Times Square & Broadway',
        description: 'Experience Broadway magic',
        time: '19:00',
        location: 'Broadway, NYC',
        category: 'theater',
      },
      {
        id: '2',
        day: 2,
        title: 'Statue of Liberty',
        description: 'Visit Lady Liberty',
        time: '09:00',
        location: 'Statue of Liberty',
        category: 'landmark',
      },
    ],
    members: [
      {
        userId: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'owner',
        joinedAt: new Date(),
      },
    ],
  },
  {
    userId: testUserId,
    ownerId: testUserId,
    title: 'Barcelona Beach & Culture',
    description: 'Enjoy stunning beaches, Gaudí architecture, and vibrant nightlife in Barcelona.',
    destination: 'Barcelona, Spain',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-05'),
    budget: 1500,
    currency: 'USD',
    travelStyle: 'standard',
    interests: ['architecture', 'beach', 'food', 'art'],
    status: 'planning',
    itinerary: [
      {
        id: '1',
        day: 1,
        title: 'Sagrada Familia',
        description: 'Visit Gaudí\'s masterpiece',
        time: '10:00',
        location: 'Sagrada Familia',
        category: 'monument',
      },
    ],
    members: [
      {
        userId: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        role: 'owner',
        joinedAt: new Date(),
      },
    ],
  },
];

const sampleBucketList = [
  {
    userId: testUserId,
    title: 'Hike the Swiss Alps',
    description: 'Experience breathtaking mountain scenery and challenging trails',
    category: 'adventure',
    destination: 'Switzerland',
    priority: 'high',
    completed: false,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    userId: testUserId,
    title: 'Taste authentic Pad Thai in Bangkok',
    description: 'Learn to cook and taste real Thai street food',
    category: 'experience',
    destination: 'Bangkok, Thailand',
    priority: 'high',
    completed: false,
    image: 'https://images.unsplash.com/photo-1455521460494-0b1c3b3a1a7f?w=400',
  },
  {
    userId: testUserId,
    title: 'Visit the Great Wall of China',
    description: 'Walk along the ancient wonder of the world',
    category: 'destination',
    destination: 'China',
    priority: 'high',
    completed: false,
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
  },
  {
    userId: testUserId,
    title: 'Attend Carnival in Rio de Janeiro',
    description: 'Experience the world\'s most famous carnival',
    category: 'cultural',
    destination: 'Rio de Janeiro, Brazil',
    priority: 'medium',
    completed: false,
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400',
  },
  {
    userId: testUserId,
    title: 'Relax in the Maldives',
    description: 'Stay in an overwater bungalow and enjoy pristine beaches',
    category: 'relaxation',
    destination: 'Maldives',
    priority: 'medium',
    completed: false,
    image: 'https://images.unsplash.com/photo-1511139228881-cfeb56dbdbf0?w=400',
  },
];

const sampleCityImages = [
  {
    city: 'Paris',
    country: 'France',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
        title: 'Eiffel Tower',
        description: 'The iconic Eiffel Tower at night',
        imageType: 'landmark',
      },
      {
        url: 'https://images.unsplash.com/photo-1550340579-c1be6bd58e9e?w=500',
        title: 'Louvre Museum',
        description: 'The magnificent Louvre glass pyramid',
        imageType: 'landmark',
      },
      {
        url: 'https://images.unsplash.com/photo-1555950669-1b667a9e48b0?w=500',
        title: 'Café au Lait',
        description: 'Traditional French café culture',
        imageType: 'food',
      },
      {
        url: 'https://images.unsplash.com/photo-1508874099435-d3f5a0cea3f5?w=500',
        title: 'Seine River',
        description: 'Scenic views of the Seine',
        imageType: 'street',
      },
      {
        url: 'https://images.unsplash.com/photo-1497442671051-4b57f50f9f1d?w=500',
        title: 'Notre-Dame',
        description: 'The historic Notre-Dame Cathedral',
        imageType: 'landmark',
      },
    ],
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=500',
        title: 'Tokyo Tower',
        description: 'Iconic Tokyo Tower skyline',
        imageType: 'landmark',
      },
      {
        url: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a0?w=500',
        title: 'Senso-ji Temple',
        description: 'Ancient temple in Asakusa',
        imageType: 'culture',
      },
      {
        url: 'https://images.unsplash.com/photo-1579769726051-4e042af0a77c?w=500',
        title: 'Sushi Paradise',
        description: 'Fresh sushi and Japanese cuisine',
        imageType: 'food',
      },
      {
        url: 'https://images.unsplash.com/photo-1522383630252-895f97e5edfb?w=500',
        title: 'Shibuya Crossing',
        description: 'The world\'s busiest crossing',
        imageType: 'street',
      },
      {
        url: 'https://images.unsplash.com/photo-1598639957487-b51db56de189?w=500',
        title: 'Shinjuku Park',
        description: 'Beautiful urban park',
        imageType: 'park',
      },
    ],
  },
  {
    city: 'New York City',
    country: 'USA',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500',
        title: 'Statue of Liberty',
        description: 'Symbol of freedom and democracy',
        imageType: 'landmark',
      },
      {
        url: 'https://images.unsplash.com/photo-1513581171538-c3ce00202914?w=500',
        title: 'Times Square',
        description: 'Bright lights of Times Square',
        imageType: 'street',
      },
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561d1f?w=500',
        title: 'NYC Pizza',
        description: 'Authentic New York pizza',
        imageType: 'food',
      },
      {
        url: 'https://images.unsplash.com/photo-1502515917235-de2e36394c1e?w=500',
        title: 'Central Park',
        description: 'Iconic Central Park landscape',
        imageType: 'park',
      },
      {
        url: 'https://images.unsplash.com/photo-1508872087620-c8707b9d4ffd?w=500',
        title: 'Grand Central Terminal',
        description: 'Historic train station interior',
        imageType: 'landmark',
      },
    ],
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1562883676-8c6fbdf76c91?w=500',
        title: 'Sagrada Familia',
        description: 'Gaudí\'s masterpiece basilica',
        imageType: 'landmark',
      },
      {
        url: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=500',
        title: 'Barcelona Beach',
        description: 'Beautiful Mediterranean beach',
        imageType: 'park',
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
        title: 'Tapas Culture',
        description: 'Spanish tapas and wine',
        imageType: 'food',
      },
      {
        url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500',
        title: 'Gothic Quarter Streets',
        description: 'Narrow streets of the Gothic Quarter',
        imageType: 'street',
      },
      {
        url: 'https://images.unsplash.com/photo-1505577058444-a3dabdd60c0b?w=500',
        title: 'Park Güell',
        description: 'Gaudí\'s iconic park with mosaic art',
        imageType: 'architecture',
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Trip.deleteMany({ userId: testUserId });
    await BucketListItem.deleteMany({ userId: testUserId });
    await SocialTrip.deleteMany({ userId: testUserId });
    await CityImage.deleteMany({});

    // Seed trips
    console.log('📍 Seeding trips...');
    const trips = await Trip.insertMany(sampleTrips);
    console.log(`✅ Created ${trips.length} trips`);

    // Seed bucket list
    console.log('📋 Seeding bucket list items...');
    const bucketList = await BucketListItem.insertMany(sampleBucketList);
    console.log(`✅ Created ${bucketList.length} bucket list items`);

    // Create social trips from completed trips
    console.log('👥 Seeding social trips...');
    const completedTrips = trips.filter((t) => t.status === 'completed');
    const socialTrips = completedTrips.map((trip) => ({
      tripId: trip._id,
      userId: testUserId,
      userName: 'John Traveler',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnTraveler',
      title: trip.title,
      description: trip.description,
      destination: trip.destination,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
      thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200',
      startDate: trip.startDate,
      endDate: trip.endDate,
      isPublic: true,
      likes: [],
      comments: [
        {
          id: '1',
          userName: 'Travel Enthusiast',
          text: 'Amazing trip! Love the photos!',
          createdAt: new Date(),
        },
      ],
      views: Math.floor(Math.random() * 500) + 50,
    }));

    const created = await SocialTrip.insertMany(socialTrips);
    console.log(`✅ Created ${created.length} social trips`);

    // Seed city images
    console.log('🖼️  Seeding city images...');
    const cityImages = await CityImage.insertMany(sampleCityImages);
    console.log(`✅ Created ${cityImages.length} city image collections`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`
📊 Summary:
  - Trips: ${trips.length}
  - Bucket List Items: ${bucketList.length}
  - Social Trips: ${created.length}
  - City Image Collections: ${cityImages.length}

🔑 Test User ID: ${testUserId}
📝 Use this user ID when testing the application
    `);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
