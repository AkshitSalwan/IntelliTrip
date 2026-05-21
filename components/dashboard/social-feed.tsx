'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
  Empty,
  EmptyContent,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty'

interface SocialTrip {
  _id: string
  title: string
  description: string
  destination: string
  userName: string
  userAvatar?: string
  likes: string[]
  comments: Array<{
    id: string
    userName: string
    text: string
    createdAt: Date
  }>
  startDate: string
  endDate: string
  thumbnail?: string
  views: number
}

export function SocialFeed() {
  const [trips, setTrips] = useState<SocialTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [commentText, setCommentText] = useState<{
    [key: string]: string
  }>({})
  const [expandedTrip, setExpandedTrip] =
    useState<string | null>(null)

  useEffect(() => {
    fetchFeed()
  }, [page])

  const fetchFeed = async () => {
    try {
      const response = await fetch(
        `/api/social/feed?page=${page}`
      )

      const data = await response.json()

      if (data.trips && Array.isArray(data.trips)) {
        if (page === 1) {
          setTrips(data.trips)
        } else {
          setTrips((prev) => [
            ...prev,
            ...data.trips,
          ])
        }
      } else {
        if (page === 1) {
          setTrips([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error)
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tripId: string) => {
    try {
      const response = await fetch(
        `/api/social/${tripId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'like',
          }),
        }
      )

      if (response.ok) {
        const updated = await response.json()

        setTrips(
          trips.map((trip) =>
            trip._id === tripId ? updated : trip
          )
        )
      }
    } catch (error) {
      console.error('Error liking trip:', error)
      toast.error('Failed to like trip')
    }
  }

  const handleAddComment = async (
    tripId: string
  ) => {
    const text = commentText[tripId]?.trim()

    if (!text) return

    try {
      const response = await fetch(
        `/api/social/${tripId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            action: 'comment',
            text,
          }),
        }
      )

      if (response.ok) {
        const updated = await response.json()

        setTrips(
          trips.map((trip) =>
            trip._id === tripId
              ? updated
              : trip
          )
        )

        setCommentText({
          ...commentText,
          [tripId]: '',
        })

        toast.success('Comment added!')
      }
    } catch (error) {
      console.error(
        'Error adding comment:',
        error
      )

      toast.error('Failed to add comment')
    }
  }

  if (loading && trips.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-[500px] w-full rounded-2xl"
          />
        ))}
      </div>
    )
  }

  if (!loading && trips.length === 0) {
    return (
      <Empty>
        <EmptyMedia>🌍</EmptyMedia>

        <EmptyContent>
          <EmptyTitle>
            No trips yet
          </EmptyTitle>

          <EmptyDescription>
            Be the first to share your
            amazing journey with the
            community!
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    )
  }
return (
  <div className="max-w-7xl mx-auto px-4">
    {/* Instagram Style Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <Card
          key={trip._id}
          className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 group"
        >
          {/* Header */}
          <div className="p-4 flex items-center gap-3 border-b bg-background">
            {trip.userAvatar ? (
              <img
                src={trip.userAvatar}
                alt={trip.userName}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                👤
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {trip.userName}
              </div>

              <div className="text-xs text-muted-foreground truncate">
                📍 {trip.destination}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {trip.thumbnail ? (
              <img
                src={trip.thumbnail}
                alt={trip.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <span className="text-6xl">🌍</span>
              </div>
            )}

            {/* Overlay Stats */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-6 text-white font-semibold">
                <div className="flex items-center gap-2">
                  ❤️
                  <span>{trip.likes.length}</span>
                </div>

                <div className="flex items-center gap-2">
                  💬
                  <span>{trip.comments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">
                {trip.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {trip.description}
              </p>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(trip._id)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {trip.likes.length}
                </button>

                <button
                  onClick={() =>
                    setExpandedTrip(
                      expandedTrip === trip._id
                        ? null
                        : trip._id
                    )
                  }
                  className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {trip.comments.length}
                </button>
              </div>

              <button className="hover:text-green-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Comments */}
            {expandedTrip === trip._id && (
              <div className="space-y-3 pt-3 border-t">
                {trip.comments.length > 0 && (
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {trip.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-muted rounded-lg p-2 text-sm"
                      >
                        <div className="font-semibold text-xs">
                          {comment.userName}
                        </div>

                        <p className="text-muted-foreground text-sm">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText[trip._id] || ''}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [trip._id]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(trip._id)
                      }
                    }}
                    className="bg-background"
                  />

                  <Button
                    size="sm"
                    onClick={() => handleAddComment(trip._id)}
                    disabled={!commentText[trip._id]?.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Load More */}
    {trips.length > 0 && (
      <div className="flex justify-center pt-8">
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
        >
          Load More
        </Button>
      </div>
    )}
  </div>
)


}