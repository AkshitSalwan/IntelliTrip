'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: Date
}

interface Passport {
    countriesVisited: string[]
    citiesVisited: string[]
    totalTrips: number
    totalDaysAway: number
    achievements: Achievement[]
}

export function ExperiencePassport() {
    const [passport, setPassport] = useState<Passport | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPassport = async () => {
            try {
                const response = await fetch('/api/passport')
                const data = await response.json()
                setPassport(data)
            } catch (error) {
                console.error('Failed to fetch passport:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPassport()
    }, [])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!passport) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Experience Passport</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No data available. Complete a trip first!</p>
                </CardContent>
            </Card>
        )
    }

    const safePassport = {
        countriesVisited: passport?.countriesVisited || [],
        citiesVisited: passport?.citiesVisited || [],
        totalTrips: passport?.totalTrips || 0,
        totalDaysAway: passport?.totalDaysAway || 0,
        achievements: passport?.achievements || [],
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">✈️</span> Experience Passport
                </CardTitle>
                <CardDescription>Your travel achievements and milestones</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="locations">Locations</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <div className="rounded-2xl border bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-lg">
                                <div className="text-sm opacity-80">Total Trips</div>
                                <div className="text-4xl font-bold mt-2">
                                    {safePassport.totalTrips}
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white shadow-lg">
                                <div className="text-sm opacity-80">Countries Visited</div>
                                <div className="text-4xl font-bold mt-2">
                                    {safePassport.countriesVisited.length}
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-lg">
                                <div className="text-sm opacity-80">Days Away</div>
                                <div className="text-4xl font-bold mt-2">
                                    {safePassport.totalDaysAway}
                                </div>
                            </div>

                        </div>

                        {/* Travel Progress */}
                        <div className="rounded-2xl border p-5 bg-muted/40">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Travel Progress</h3>
                                <span className="text-sm text-muted-foreground">
                                    Explorer Level
                                </span>
                            </div>

                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                    style={{
                                        width: `${Math.min(
                                            safePassport.totalTrips * 10,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                                Complete more trips to level up your passport.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="locations" className="space-y-6 mt-6">

                        <div className="rounded-2xl border p-5">
                            <h3 className="font-semibold text-lg mb-4">
                                🌍 Countries Visited
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {safePassport.countriesVisited.length > 0 ? (
                                    safePassport.countriesVisited.map((country) => (
                                        <Badge
                                            key={country}
                                            className="px-4 py-2 rounded-full text-sm"
                                            variant="secondary"
                                        >
                                            {country}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">
                                        No countries visited yet
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border p-5">
                            <h3 className="font-semibold text-lg mb-4">
                                🏙️ Cities Explored
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {safePassport.citiesVisited.length > 0 ? (
                                    safePassport.citiesVisited.map((city) => (
                                        <Badge
                                            key={city}
                                            className="px-4 py-2 rounded-full"
                                            variant="outline"
                                        >
                                            {city}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">
                                        No cities visited yet
                                    </p>
                                )}
                            </div>
                        </div>

                    </TabsContent>

                    <TabsContent value="achievements" className="mt-6">
                        {safePassport.achievements.length > 0 ? (

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {safePassport.achievements.map((achievement) => (

                                    <div
                                        key={achievement.id}
                                        className="rounded-2xl border bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 p-5 shadow-sm hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-4">

                                            <div className="text-5xl">
                                                {achievement.icon}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {achievement.name}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.description}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="rounded-2xl border border-dashed p-10 text-center">
                                <div className="text-5xl mb-4">🏆</div>

                                <h3 className="font-semibold text-lg">
                                    No Achievements Yet
                                </h3>

                                <p className="text-muted-foreground mt-2">
                                    Complete trips to unlock travel badges and milestones.
                                </p>
                            </div>

                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
