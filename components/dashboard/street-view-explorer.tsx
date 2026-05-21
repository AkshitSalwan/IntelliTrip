'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CityImageData {
  city: string
  country: string
  images: Array<{
    url: string
    title: string
    description: string
    imageType: string
  }>
}

interface StreetViewProps {
  city?: string
  country?: string
}

export function StreetViewExplorer({ city = '', country = '' }: StreetViewProps) {
  const [cityData, setCityData] = useState<CityImageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!city || !country) return

    const fetchCityImages = async () => {
      try {
        const response = await fetch(
          `/api/city-images?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        )
        const data = await response.json()
        setCityData(data)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Failed to fetch city images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCityImages()
  }, [city, country])

  if (!city || !country) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Street View Explorer</CardTitle>
          <CardDescription>Select a destination to explore</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            No destination selected
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!cityData || !cityData.images || cityData.images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Street View Explorer</CardTitle>
          <CardDescription>No images available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentImage = cityData.images[currentIndex]
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % cityData.images.length)
  }
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + cityData.images.length) % cityData.images.length)
  }

  const typeEmojis = {
    landmark: '🏛️',
    street: '🏘️',
    park: '🌳',
    food: '🍽️',
    culture: '🎭',
    architecture: '🏗️',
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span> Street View Explorer
        </CardTitle>
        <CardDescription>
          Explore {cityData.city}, {cityData.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Image */}
        <div className="relative w-full overflow-hidden rounded-lg bg-muted aspect-video">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="w-full h-full object-cover"
          />
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {cityData.images.length}
          </div>
        </div>

        {/* Image Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {typeEmojis[currentImage.imageType as keyof typeof typeEmojis] || '📷'}
            </span>
            <h3 className="text-lg font-semibold">{currentImage.title}</h3>
            <Badge variant="outline">{currentImage.imageType}</Badge>
          </div>
          <p className="text-muted-foreground">{currentImage.description}</p>
        </div>

        {/* Thumbnails */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Gallery</h4>
          <div className="grid grid-cols-5 gap-2">
            {cityData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative overflow-hidden rounded-lg aspect-square transition-all ${
                  idx === currentIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold bg-black/30">
                  {typeEmojis[img.imageType as keyof typeof typeEmojis] || '📷'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {cityData.images.map((img, idx) => (
            <Badge
              key={idx}
              variant={idx === currentIndex ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              {typeEmojis[img.imageType as keyof typeof typeEmojis] || '📷'} {img.imageType}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
