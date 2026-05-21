import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { SocialTrip } from '@/lib/models/social-trip'
import { User } from '@/lib/models/user'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // FIX
    const { id } = await params

    const body = await req.json()
    const { action } = body

    if (action === 'like') {

      const trip = await SocialTrip.findById(id)

      if (!trip) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        )
      }

      if (trip.likes.includes(userId)) {
        trip.likes = trip.likes.filter(
          (likedUserId: string) => likedUserId !== userId
        )
      } else {
        trip.likes.push(userId)
      }

      await trip.save()

      return NextResponse.json(trip)
    }

    if (action === 'comment') {

      const { text } = body

      const user = await User.findOne({
        clerkId: userId
      })

      const trip = await SocialTrip.findById(id)

      if (!trip) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        )
      }

      trip.comments.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        userName: user
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous',
        userAvatar: user?.avatar || '',
        text,
        createdAt: new Date(),
      })

      await trip.save()

      return NextResponse.json(trip)
    }

    if (action === 'deleteComment') {

      const { commentId } = body

      const trip = await SocialTrip.findById(id)

      if (!trip) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        )
      }

      trip.comments = trip.comments.filter(
        (c: any) => c.id !== commentId
      )

      await trip.save()

      return NextResponse.json(trip)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating social trip:', error)

    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}