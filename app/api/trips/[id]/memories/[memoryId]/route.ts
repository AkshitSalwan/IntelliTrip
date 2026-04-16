import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { NextResponse } from 'next/server';
import { getCloudinary, extractCloudinaryPublicId } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memoryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, memoryId } = await params;

    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const memory = trip.memories?.find((m: any) => m.id === memoryId);
    if (memory) {
      try {
        const publicId = memory.publicId || extractCloudinaryPublicId(memory.url);
        if (publicId) {
          const cloudinary = getCloudinary();
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        }
      } catch (blobError) {
        console.error('Error deleting Cloudinary asset:', blobError);
      }
    }

    trip.memories = trip.memories?.filter(
      (m: any) => m.id !== memoryId
    ) || [];
    await trip.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
