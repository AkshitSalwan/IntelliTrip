import mongoose, { Document, Schema } from 'mongoose'

export interface IAchievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}

export interface IPassport {
  countriesVisited: string[]
  citiesVisited: string[]
  totalTrips: number
  totalDaysAway: number
  achievements: IAchievement[]
}

export interface IUser extends Document {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  trips: mongoose.Types.ObjectId[]
  bucketList: mongoose.Types.ObjectId[]
  publicProfile: boolean
  passport: IPassport
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    bucketList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BucketListItem',
      },
    ],
    publicProfile: {
      type: Boolean,
      default: false,
    },
    passport: {
      countriesVisited: [String],
      citiesVisited: [String],
      totalTrips: { type: Number, default: 0 },
      totalDaysAway: { type: Number, default: 0 },
      achievements: [
        {
          id: String,
          name: String,
          description: String,
          icon: String,
          unlockedAt: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
