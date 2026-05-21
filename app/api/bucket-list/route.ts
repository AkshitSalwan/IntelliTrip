import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { BucketListItem } from '@/lib/models/bucket-list'

export async function GET() {
  try {
    await connectDB()

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    const items = await BucketListItem
      .find({ userId })
      .sort({ createdAt: -1 })

    return NextResponse.json(items)

  } catch (error) {
    console.error('Error fetching bucket list:', error)

    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const item = await BucketListItem.create({
      userId,
      ...body
    })

    return NextResponse.json(item, { status: 201 })

  } catch (error) {
    console.error('Error creating bucket list item:', error)

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}