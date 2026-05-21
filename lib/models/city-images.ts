import mongoose, { Document, Schema } from 'mongoose'

export interface ICityImage {
  city: string
  country: string
  images: Array<{
    url: string
    title: string
    description: string
    imageType: 'landmark' | 'street' | 'park' | 'food' | 'culture' | 'architecture'
  }>
  createdAt: Date
}

const CityImageSchema = new Schema<ICityImage>(
  {
    city: {
      type: String,
      required: true,
      lowercase: true,
    },
    country: {
      type: String,
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
)

CityImageSchema.index({ city: 1, country: 1 }, { unique: true })

export const CityImage =
  mongoose.models.CityImage || mongoose.model<ICityImage>('CityImage', CityImageSchema)
