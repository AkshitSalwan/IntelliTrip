import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Map, Zap, Users, DollarSign, Star, Globe, PlaneLanding, MapPin, Clock, Compass, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPinIcon } from 'lucide-react';

export default function Home() {
  const destinations = [
    {
      name: 'Paris, France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
      description: 'The City of Light awaits your discovery',
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg',
      description: 'Modern meets tradition in vibrant Tokyo',
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
      description: 'Tropical paradise and cultural wonders',
    },
    {
      name: 'New York, USA',
      image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
      description: 'The city that never sleeps',
    },
    {
      name: 'Dubai, UAE',
      image: 'https://images.pexels.com/photos/1287854/pexels-photo-1287854.jpeg',
      description: 'Luxury and innovation combined',
    },
    {
      name: 'Barcelona, Spain',
      image: 'https://images.pexels.com/photos/5247714/pexels-photo-5247714.jpeg',
      description: 'Architecture and culture by the sea',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Travel Enthusiast',
      content: 'IntelliTrip made planning my European vacation so easy. AI suggestions were spot-on!',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    {
      name: 'Michael Chen',
      role: 'Adventure Seeker',
      content: 'The budget tracking feature saved me so much money on my group trip!',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Family Planner',
      content: 'Collaborating with family members was seamless. Highly recommend!',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    },
  ];

  const stats = [
    { label: 'Happy Travelers', value: '50K+', icon: Users },
    { label: 'Trips Planned', value: '100K+', icon: Map },
    { label: 'Destinations', value: '190+', icon: Globe },
    { label: 'Budget Saved', value: '$5M+', icon: DollarSign },
  ];

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

      {/* Enhanced Hero Section with Background Image */}
      <section className="relative overflow-hidden px-4 py-32">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(147,51,234,0.4) 0%, rgba(196,181,253,0.4) 100%), url(https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-2 mb-6">
            <PlaneLanding className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">✨ Your AI Travel Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Plan Your Perfect Journey with AI
          </h1>
          <p className="mt-6 text-lg text-white/90 drop-shadow">
            IntelliTrip helps you create intelligent itineraries, manage budgets,
            and collaborate with fellow travelers. Let AI handle the planning while
            you focus on the adventure.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="btn-gradient">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center card-soft">
                <div className="inline-flex rounded-full bg-gradient-to-br from-pink-200 to-purple-200 p-4 mb-4">
                  <stat.icon className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Powerful Features Built for Travelers
          </h2>
          <p className="mb-16 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover everything you need to plan, track, and share your perfect adventure
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'AI Itineraries',
                description: 'Get intelligent itineraries based on your preferences and travel style',
                color: 'from-pink-200 to-purple-200',
              },
              {
                icon: DollarSign,
                title: 'Budget Tracking',
                description: 'Monitor expenses in real-time and stay within your budget',
              },
              {
                icon: Map,
                title: 'Smart Planning',
                description: 'Adaptive planning that evolves with your trip and preferences',
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Plan together with friends and family in real-time',
              },
              {
                icon: Compass,
                title: 'Explore Destinations',
                description: 'Discover hidden gems and local recommendations',
              },
              {
                icon: Clock,
                title: 'Time Management',
                description: 'Optimize your schedule for the best experience',
              },
              {
                icon: Star,
                title: 'Trip Reviews',
                description: 'Share memories and rate your experiences',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Plan trips to 190+ countries worldwide',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-soft group border-purple-200/50 hover-lift transition-all"
              >
                <div className={`mb-4 inline-flex rounded-full bg-gradient-to-br ${feature.color || 'from-purple-200 to-pink-200'} p-3`}>
                  <feature.icon className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Carousel Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-transparent to-purple-50/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Explore Popular Destinations
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Start your journey to these amazing places with IntelliTrip
          </p>
          <Carousel className="w-full">
            <CarouselContent>
              {destinations.map((destination) => (
                <CarouselItem key={destination.name} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 overflow-hidden hover-lift">
                    <CardContent className="p-0">
                      <div className="relative h-64 w-full overflow-hidden rounded-lg">
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{destination.name}</h3>
                          <p className="text-sm text-white/90">{destination.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            What Our Travelers Say
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Thousands of travelers trust IntelliTrip to plan their adventures
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-purple-200/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-6 md:gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Create Trip', description: 'Start by creating your new trip and basic details' },
              { step: '2', title: 'Generate Itinerary', description: 'Let AI create a personalized itinerary' },
              { step: '3', title: 'Collaborate', description: 'Invite friends and plan together' },
              { step: '4', title: 'Enjoy', description: 'Track expenses and share memories' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                {/* Number circle */}
                <div className="mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                {/* Content card */}
                <div className="card-soft w-full h-full pt-4 pb-6 px-4">
                  <h3 className="font-semibold text-foreground mb-3 text-center">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Glass Effect */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl glass-effect p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Plan Your Adventure?</h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of travelers using IntelliTrip to create unforgettable journeys.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="btn-gradient">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-teal-200/50 bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          {/* Main Footer Content */}
          <div className="grid gap-8 md:grid-cols-5 mb-12">
            {/* Brand Section */}
            <div className="col-span-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                IntelliTrip
              </h3>
              <p className="text-sm text-purple-200 mb-6">
                Your AI-powered travel companion for perfect journeys
              </p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-pink-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-pink-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-pink-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-pink-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Features</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Pricing</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Security</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Roadmap</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">About Us</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Blog</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Careers</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Press</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Help Center</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Documentation</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">API Docs</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">Cookie Policy</Link></li>
                <li><Link href="#" className="text-purple-300 hover:text-pink-400 transition-colors text-sm">GDPR</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-purple-400/30 p-6 mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Subscribe to Our Newsletter</h4>
                <p className="text-sm text-purple-300">Get travel tips, destination guides, and exclusive offers</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-purple-900/50 border border-purple-400/30 text-white placeholder-purple-400 focus:outline-none focus:border-pink-400"
                />
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-sm text-purple-300">support@intellitrip.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Phone</p>
                <p className="text-sm text-purple-300">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Address</p>
                <p className="text-sm text-purple-300">123 Travel Street, San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-purple-700 pt-8">
            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-purple-300">
                &copy; 2024 IntelliTrip. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="#" className="text-sm text-purple-300 hover:text-pink-400 transition-colors">
                  Sitemap
                </Link>
                <Link href="#" className="text-sm text-purple-300 hover:text-pink-400 transition-colors">
                  Status
                </Link>
                <Link href="#" className="text-sm text-purple-300 hover:text-pink-400 transition-colors">
                  Changelog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
