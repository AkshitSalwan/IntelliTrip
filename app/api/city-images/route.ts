import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { CityImage } from '@/lib/models/city-images'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const country = searchParams.get('country')

    if (!city || !country) {
      return NextResponse.json(
        { error: 'City and country are required' },
        { status: 400 }
      )
    }

    const cityData = await CityImage.findOne({
      city: city.toLowerCase(),
      country,
    })

    if (cityData) {
      return NextResponse.json(cityData)
    }

    // Return default placeholder data if not found
    return NextResponse.json({
      city: city,
      country: country,
      images: [
        {
          url: `https://images.unsplash.com/photo-1488749807830-63789f68bb65?w=800&h=600&fit=crop`,
          title: `${city} Landmark`,
          description: 'Popular landmark in ' + city,
          imageType: 'landmark',
        },
        {
          url: `https://images.unsplash.com/photo-1488749807830-63789f68bb65?w=800&h=600&fit=crop`,
          title: `${city} Street`,
          description: 'Beautiful streets of ' + city,
          imageType: 'street',
        },
        {
          url: `https://images.unsplash.com/photo-1488749807830-63789f68bb65?w=800&h=600&fit=crop`,
          title: `${city} Culture`,
          description: 'Cultural sites in ' + city,
          imageType: 'culture',
        },
        {
          url: `https://images.unsplash.com/photo-1488749807830-63789f68bb65?w=800&h=600&fit=crop`,
          title: `${city} Food Scene`,
          description: 'Local food and dining in ' + city,
          imageType: 'food',
        },
        {
          url: `https://images.unsplash.com/photo-1488749807830-63789f68bb65?w=800&h=600&fit=crop`,
          title: `${city} Parks`,
          description: 'Green spaces and parks in ' + city,
          imageType: 'park',
        },
      ],
    })
  } catch (error) {
    console.error('Error fetching city images:', error)
    return NextResponse.json({ error: 'Failed to fetch city images' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const cityData = await CityImage.findOneAndUpdate(
      { city: body.city.toLowerCase(), country: body.country },
      body,
      { upsert: true, new: true }
    )

    return NextResponse.json(cityData, { status: 201 })
  } catch (error) {
    console.error('Error saving city images:', error)
    return NextResponse.json({ error: 'Failed to save city images' }, { status: 500 })
  }
}
