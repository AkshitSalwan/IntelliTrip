'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface PublishTripButtonProps {
  tripId: string
  onPublished?: () => void
}

export function PublishTripButton({ tripId, onPublished }: PublishTripButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePublish = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      })

      if (response.ok) {
        toast.success('Trip published to social feed!')
        setOpen(false)
        onPublished?.()
      } else {
        toast.error('Failed to publish trip')
      }
    } catch (error) {
      console.error('Error publishing trip:', error)
      toast.error('Failed to publish trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Publish
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Trip to Social Feed?</AlertDialogTitle>
            <AlertDialogDescription>
              Share this trip with the IntelliTrip community. Others will be able to like and
              comment on your trip. You can manage who sees your trips in your privacy settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
