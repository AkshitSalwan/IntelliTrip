import mongoose, { Document, Schema } from 'mongoose'

export interface ISocialComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  createdAt: Date
}

export interface ISocialTrip extends Document {
  tripId: mongoose.Types.ObjectId
  userId: string
  userName: string
  userAvatar?: string
  title: string
  description: string
  destination: string
  coverImage?: string
  thumbnail?: string
  startDate: Date
  endDate: Date
  isPublic: boolean
  likes: string[] // Array of userIds who liked
  comments: ISocialComment[]
  views: number
  createdAt: Date
  updatedAt: Date
}

const SocialTripSchema = new Schema<ISocialTrip>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
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
    coverImage: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: [String],
    comments: [
      {
        id: String,
        userId: String,
        userName: String,
        userAvatar: String,
        text: String,
        createdAt: Date,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const SocialTrip =
  mongoose.models.SocialTrip ||
  mongoose.model<ISocialTrip>('SocialTrip', SocialTripSchema)
