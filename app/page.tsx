import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Zap, Users, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-teal-200/50 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
            IntelliTrip
          </div>
          <Link href="/sign-in">
            <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden px-4 py-28 gradient-primary-to-accent">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.3) 0%, transparent 50%)'}}></div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold text-blue-900 md:text-6xl">
            Plan Your Perfect Journey with AI
          </h1>
          <p className="mt-6 text-lg text-blue-800/80">
            IntelliTrip helps you create intelligent itineraries, manage budgets,
            and collaborate with fellow travelers. Let AI handle the planning while
            you focus on the adventure.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="btn-gradient mt-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold text-foreground">
            Powerful Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'AI Itineraries',
                description: 'Get intelligent itineraries based on your preferences',
              },
              {
                icon: DollarSign,
                title: 'Budget Tracking',
                description: 'Monitor expenses and stay within your budget',
              },
              {
                icon: Map,
                title: 'Smart Planning',
                description: 'Adaptive planning that evolves with your trip',
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Plan together with friends and family',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-soft group border-purple-200/50 hover-lift"
              >
                <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-pink-200 to-purple-200 p-3">
                  <feature.icon className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Glass Effect */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl glass-effect p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Plan Your Adventure?</h2>
          <p className="mt-4 text-muted-foreground">
            Sign up now and start planning your next trip with AI assistance.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="btn-gradient mt-8">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-200/50 bg-gradient-to-b from-cyan-50 to-teal-50 px-4 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>&copy; 2024 IntelliTrip. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
