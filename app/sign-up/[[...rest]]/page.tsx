import { SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-primary-to-accent">
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-lg p-8 shadow-xl border border-white/30">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
            IntelliTrip
          </h1>
          <p className="mt-2 text-sm text-teal-600">
            Plan your perfect journey with AI assistance
          </p>
        </div>
        <SignUp forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
