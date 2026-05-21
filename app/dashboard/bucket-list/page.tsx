import { BucketList } from '@/components/dashboard/bucket-list'

export default function BucketListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bucket List</h1>
        <p className="text-muted-foreground mt-2">
          Organize your travel dreams and track your progress
        </p>
      </div>
      <BucketList />
    </div>
  )
}
