'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Trash2, CheckCircle2, Circle } from 'lucide-react'

interface BucketListItem {
  _id: string
  title: string
  description: string
  category: string
  destination?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

export function BucketList() {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('experience')
  const [priority, setPriority] = useState('medium')
  const [destination, setDestination] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/bucket-list')
      const data = await response.json()
      if (Array.isArray(data)) {
        setItems(data)
      } else if (data.items) {
        setItems(data.items)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Failed to fetch bucket list:', error)
      toast.error('Failed to load bucket list')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      const response = await fetch('/api/bucket-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          destination,
          priority,
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setItems([newItem, ...items])
        setTitle('')
        setDescription('')
        setCategory('experience')
        setPriority('medium')
        setDestination('')
        toast.success('Added to bucket list!')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/bucket-list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      })

      if (response.ok) {
        setItems(items.map((item) => (item._id === id ? { ...item, completed: !completed } : item)))
        toast.success(completed ? 'Unmarked as completed' : 'Great! Marked as completed!')
      }
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/bucket-list/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(items.filter((item) => item._id !== id))
        toast.success('Deleted from bucket list')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const categoryIcons = {
    destination: '🗺️',
    experience: '🎯',
    food: '🍽️',
    adventure: '🏔️',
    culture: '🏛️',
    other: '⭐',
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📝</span> Bucket List
        </CardTitle>
        <CardDescription>Your travel dreams and goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="space-y-4 p-4 bg-muted rounded-lg">
          <div>
            <Input
              placeholder="What do you want to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background"
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="destination">Destination</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full">
            Add to Bucket List
          </Button>
        </form>

        {/* Items List */}
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item._id}
                className={`p-4 border rounded-lg transition-all ${
                  item.completed ? 'bg-muted opacity-60' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(item._id, item.completed)}
                    className="mt-1 transition-colors"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[item.category as keyof typeof categoryIcons] || '⭐'}</span>
                      <h3 className={`font-semibold ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={priorityColors[item.priority]}>
                        {item.priority}
                      </Badge>
                      {item.destination && (
                        <Badge variant="outline">📍 {item.destination}</Badge>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">Start adding your bucket list items!</p>
          )}
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Completed: <span className="font-semibold">{items.filter((i) => i.completed).length}</span> of{' '}
              <span className="font-semibold">{items.length}</span>
            </p>
            <div className="w-full bg-background rounded mt-2 h-2">
              <div
                className="bg-green-500 h-2 rounded transition-all"
                style={{
                  width: `${items.length > 0 ? (items.filter((i) => i.completed).length / items.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
