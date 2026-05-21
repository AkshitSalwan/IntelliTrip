import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { SocialTrip } from '@/lib/models/social-trip'
import { getUserId } from '@/lib/dev-utils'

export async function GET(req: Request) {
  try {
    await connectDB()

    const page = new URL(req.url).searchParams.get('page') || '1'
    const limit = 10
    const skip = (parseInt(page) - 1) * limit

    const trips = await SocialTrip.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .catch(() => [])

    const total = await SocialTrip.countDocuments({ isPublic: true }).catch(() => 0)

    return NextResponse.json({
      trips: trips || [],
      total: total || 0,
      page: parseInt(page),
      pages: Math.ceil((total || 1) / limit),
    })
  } catch (error) {
    console.error('Error fetching social feed:', error)
    return NextResponse.json({
      trips: [],
      total: 0,
      page: 1,
      pages: 0,
    })
  }
}
