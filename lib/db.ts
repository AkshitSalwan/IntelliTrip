import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (
  MONGODB_URI?.includes('cluster.mongodb.net') ||
  MONGODB_URI?.includes('username:password@cluster.mongodb.net')
) {
  throw new Error(
    'Invalid MONGODB_URI: replace the placeholder MongoDB host with your real Atlas cluster hostname.'
  )
}

if (!MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local')
}

// Global connection caching
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export const connectDB = dbConnect
