import mongoose, { Document, Schema } from 'mongoose'

export interface ITripMember {
  userId: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
}

export interface ITripActivity {
  id: string
  day: number
  title: string
  description: string
  time: string
  location: string
  category: string
}

export interface ITripMemory {
  id: string
  url: string
  publicId: string
  caption?: string
  uploadedAt: string
}

export interface ITrip extends Document {
  userId: string
  ownerId: string
  title: string
  description: string
  destination: string
  startDate: Date
  endDate: Date
  budget: number
  currency: string
  travelStyle: 'luxury' | 'standard' | 'budget' | 'adventure'
  interests: string[]
  members: ITripMember[]
  itinerary: ITripActivity[]
  expenses: Array<{
    id: string
    description: string
    amount: number
    category: string
    paidBy: string
    date: Date
  }>
  memories: ITripMemory[]
  images: Array<{
    url: string
    uploadedAt: Date
    uploadedBy: string
  }>
  status: 'planning' | 'ongoing' | 'completed'
  createdAt: Date
  updatedAt: Date
}

const TripSchema = new Schema<ITrip>(
  {
    userId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    travelStyle: {
      type: String,
      enum: ['luxury', 'standard', 'budget', 'adventure'],
      default: 'standard',
    },
    interests: {
      type: [String],
      default: [],
    },
    members: [
      {
        userId: String,
        name: String,
        email: String,
        role: {
          type: String,
          enum: ['owner', 'editor', 'viewer'],
          default: 'viewer',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        startTime: String,
        endTime: String,
        location: String,
        cost: {
          type: Number,
          default: 0,
        },
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
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed'],
      default: 'planning',
    },
  },
  {
    timestamps: true,
  }
)

export const Trip = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema)
