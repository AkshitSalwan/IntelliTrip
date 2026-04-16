import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { Trip } from '@/lib/models/trip';
import { NextResponse } from 'next/server';
import { getCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

function uploadToCloudinary(buffer: Buffer, folder: string, filename: string) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const cloudinary = getCloudinary();
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `${id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer, `trip-memories/${id}`, filename);

    const memory = {
      id: Date.now().toString(),
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      caption: formData.get('caption') as string | undefined,
      uploadedAt: new Date().toISOString(),
    };

    trip.memories = trip.memories || [];
    trip.memories.push(memory);
    await trip.save();

    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error uploading memory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


