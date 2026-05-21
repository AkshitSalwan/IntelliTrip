import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'
import { Trip } from '@/lib/models/trip'
import { getUserId } from '@/lib/dev-utils'



export async function GET() {
  try {
    await connectDB()

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({
        countriesVisited: [],
        citiesVisited: [],
        totalTrips: 0,
        totalDaysAway: 0,
        achievements: [],
      })
    }

    // FIXED QUERY
    const trips = await Trip.find({
      userId,
    }).sort({ createdAt: -1 })

    const countriesVisited = new Set<string>()
    const citiesVisited = new Set<string>()

    let totalDaysAway = 0

    trips.forEach((trip: any) => {

      const destination = trip.destination || ''

      const parts = destination.split(',')

      if (parts[0]) {
        citiesVisited.add(parts[0].trim())
      }

      if (parts[1]) {
        countriesVisited.add(parts[1].trim())
      } else if (destination) {
        countriesVisited.add(destination)
      }

      // Safe date calculation
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate)
        const end = new Date(trip.endDate)

        const days = Math.ceil(
          (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
        )

        if (!isNaN(days) && days > 0) {
          totalDaysAway += days
        }
      }
    })

    const achievements = []

    if (trips.length >= 1) {
      achievements.push({
        id: 'first_trip',
        name: 'Wanderer',
        description: 'Completed your first trip',
        icon: '✈️',
        unlockedAt: new Date(),
      })
    }

    if (trips.length >= 5) {
      achievements.push({
        id: 'five_trips',
        name: 'Explorer',
        description: 'Completed 5 trips',
        icon: '🧭',
        unlockedAt: new Date(),
      })
    }

    if (countriesVisited.size >= 3) {
      achievements.push({
        id: 'three_countries',
        name: 'Globetrotter',
        description: 'Visited 3 countries',
        icon: '🌍',
        unlockedAt: new Date(),
      })
    }

    if (totalDaysAway >= 100) {
      achievements.push({
        id: 'hundred_days',
        name: 'Nomad',
        description: 'Traveled 100+ days',
        icon: '🏕️',
        unlockedAt: new Date(),
      })
    }

    return NextResponse.json({
      countriesVisited: Array.from(countriesVisited),
      citiesVisited: Array.from(citiesVisited),
      totalTrips: trips.length,
      totalDaysAway,
      achievements,
    })

  } catch (error) {

    console.error('Error fetching passport:', error)

    return NextResponse.json({
      countriesVisited: [],
      citiesVisited: [],
      totalTrips: 0,
      totalDaysAway: 0,
      achievements: [],
    })
  }
}
