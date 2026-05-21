import mongoose, { Document, Schema } from 'mongoose'

export interface IBucketListItem extends Document {
  userId: string
  title: string
  description: string
  category: string
  destination?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  completedTripId?: mongoose.Types.ObjectId
  completedDate?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
}

const BucketListItemSchema = new Schema<IBucketListItem>(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['destination', 'experience', 'food', 'adventure', 'culture', 'other'],
      default: 'other',
    },
    destination: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedTripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
    },
    completedDate: {
      type: Date,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const BucketListItem =
  mongoose.models.BucketListItem ||
  mongoose.model<IBucketListItem>('BucketListItem', BucketListItemSchema)
