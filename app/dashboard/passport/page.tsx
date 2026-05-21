import { ExperiencePassport } from '@/components/dashboard/experience-passport'

export default function PassportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Experience Passport</h1>
        <p className="text-muted-foreground mt-2">
          Track your travel achievements and unlock badges
        </p>
      </div>
      <ExperiencePassport />
    </div>
  )
}
