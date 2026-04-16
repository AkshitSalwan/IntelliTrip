import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const data = evt.data;
  const eventType = evt.type;

  try {
    await connectDB();

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address || '';

      const user = new User({
        clerkId: id,
        email,
        firstName: first_name || '',
        lastName: last_name || '',
        avatar: data.image_url || '',
      });

      await user.save();
    } else if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address || '';

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email,
          firstName: first_name || '',
          lastName: last_name || '',
          avatar: data.image_url || '',
        },
        { new: true }
      );
    } else if (eventType === 'user.deleted') {
      const { id } = data;
      await User.findOneAndDelete({ clerkId: id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
