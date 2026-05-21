'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'

interface Activity {
  id: string
  day: number
  title: string
  location: string
  time: string
  description: string
  category: string
}

interface ActivitiesMapProps {
  destination: string
  activities?: Activity[]
}

export function InteractiveTripMap({ destination, activities = [] }: ActivitiesMapProps) {
  const [mapUrl, setMapUrl] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  useEffect(() => {
    // Generate a Google Maps embed URL for the destination
    const encodedDest = encodeURIComponent(destination)
    setMapUrl(
      `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1501284873133!2d${getCoordinates(destination).lng}!3d${getCoordinates(destination).lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x${getCoordinates(destination).encoded}!2s${encodedDest}!5e0!3m2!1sen!2sus!4v${Date.now()}`
    )
  }, [destination])

  // Simple coordinate mapping for popular destinations
  const getCoordinates = (dest: string) => {
    const coords: { [key: string]: { lat: number; lng: number; encoded: string } } = {
      'Paris, France': { lat: 48.8566, lng: 2.3522, encoded: '3d48.8566!4d2.3522' },
      'Tokyo, Japan': { lat: 35.6762, lng: 139.6503, encoded: '3d35.6762!4d139.6503' },
      'New York, USA': { lat: 40.7128, lng: -74.006, encoded: '3d40.7128!4d-74.006' },
      'Barcelona, Spain': { lat: 41.3851, lng: 2.1734, encoded: '3d41.3851!4d2.1734' },
      'Rome, Italy': { lat: 41.9028, lng: 12.4964, encoded: '3d41.9028!4d12.4964' },
      'London, UK': { lat: 51.5074, lng: -0.1278, encoded: '3d51.5074!4d-0.1278' },
      'Dubai, UAE': { lat: 25.2048, lng: 55.2708, encoded: '3d25.2048!4d55.2708' },
      'Singapore': { lat: 1.3521, lng: 103.8198, encoded: '3d1.3521!4d103.8198' },
      'Bangkok, Thailand': { lat: 13.7563, lng: 100.5018, encoded: '3d13.7563!4d100.5018' },
      'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041, encoded: '3d52.3676!4d4.9041' },
    }

    return coords[dest] || { lat: 20, lng: 0, encoded: '3d20!4d0' }
  }

  const categoryEmojis = {
    Restaurant: '🍽️',
    Museum: '🏛️',
    Park: '🌳',
    Shopping: '🛍️',
    Transport: '🚗',
    Hotel: '🏨',
    Activity: '🎯',
    default: '📍',
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span> Interactive Trip Map
        </CardTitle>
        <CardDescription>Explore activities on the map for {destination}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Embed */}
        <div className="relative w-full overflow-hidden rounded-lg bg-muted aspect-video">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Activities List */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {activities.length} Activities on Map
          </h3>

          {activities.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activities
                .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                .map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedActivity?.id === activity.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-1">
                        {categoryEmojis[activity.category as keyof typeof categoryEmojis] ||
                          categoryEmojis['default']}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{activity.title}</span>
                          <Badge variant="outline" className="text-xs">
                            Day {activity.day}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">🕐 {activity.time}</p>
                        {activity.description && (
                          <p className="text-sm mt-2 text-foreground">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No activities planned yet</p>
          )}
        </div>

        {/* Quick Stats */}
        {activities.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Activities</div>
              <div className="text-2xl font-bold">{activities.length}</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Trip Duration</div>
              <div className="text-2xl font-bold">
                {Math.max(...activities.map((a) => a.day), 0)} days
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100">
          <p className="flex items-start gap-2">
            <span className="mt-1">ℹ️</span>
            <span>Click on activities to select them. The map shows the destination location.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
