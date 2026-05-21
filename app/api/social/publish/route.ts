import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { SocialTrip } from '@/lib/models/social-trip'
import { Trip } from '@/lib/models/trip'
import { User } from '@/lib/models/user'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { tripId } = body

    // Get trip details
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Get user details
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const socialTrip = await SocialTrip.create({
      tripId,
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      title: trip.title,
      description: trip.description,
      destination: trip.destination,
      coverImage: trip.images?.[0]?.url,
      thumbnail: trip.images?.[0]?.url,
      startDate: trip.startDate,
      endDate: trip.endDate,
      isPublic: true,
    })

    return NextResponse.json(socialTrip, { status: 201 })
  } catch (error) {
    console.error('Error publishing trip:', error)
    return NextResponse.json({ error: 'Failed to publish trip' }, { status: 500 })
  }
}
