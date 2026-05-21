import { SocialFeed } from '@/components/dashboard/social-feed'

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Feed</h1>
        <p className="text-muted-foreground mt-2">
          Discover and share amazing trips from the community
        </p>
      </div>
      <SocialFeed />
    </div>
  )
}
