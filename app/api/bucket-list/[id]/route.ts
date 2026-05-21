import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { BucketListItem } from '@/lib/models/bucket-list'
import { User } from '@/lib/models/user'

export async function PUT(
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

    const { id } = await params

    const body = await req.json()

    const item = await BucketListItem.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: 'after'
      }
    )

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)

  } catch (error) {
    console.error('Error updating bucket list item:', error)

    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { id } = await params

    await BucketListItem.findByIdAndDelete(id)

    await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { bucketList: id } },
      {
        returnDocument: 'after'
      }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting bucket list item:', error)

    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}