'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Sparkles, Clock, MapPin, Trash2, Edit2, X } from 'lucide-react';

interface Activity {
  id: string;
  day: number;
  title: string;
  description: string;
  time: string;
  location: string;
  category: string;
}

interface ItineraryTabProps {
  trip: any;
}

export function ItineraryTab({ trip }: ItineraryTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Activity[]>(trip.itinerary || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 1,
    title: '',
    description: '',
    time: '09:00',
    location: '',
    category: 'Sightseeing',
  });

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/trips/${trip._id}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          duration: trip.duration,
          interests: trip.interests,
          style: trip.travelStyle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setItinerary(Array.isArray(data) ? data : data.activities || []);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddActivity = () => {
    if (editingId) {
      setItinerary(
        itinerary.map(act =>
          act.id === editingId ? { ...formData, id: editingId } : act
        )
      );
      setEditingId(null);
    } else {
      setItinerary([
        ...itinerary,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }
    setFormData({
      day: 1,
      title: '',
      description: '',
      time: '09:00',
      location: '',
      category: 'Sightseeing',
    });
    setShowAddForm(false);
  };

  const handleDeleteActivity = (id: string) => {
    setItinerary(itinerary.filter(act => act.id !== id));
  };

  const handleEditActivity = (activity: Activity) => {
    setFormData(activity);
    setEditingId(activity.id);
    setShowAddForm(true);
  };

  const groupedByDay = itinerary.reduce((acc, activity) => {
    if (!acc[activity.day]) acc[activity.day] = [];
    acc[activity.day].push(activity);
    return acc;
  }, {} as Record<number, Activity[]>);

  const days = Array.from({ length: trip.duration || 3 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-white to-cyan-50/20 p-6">
      {!itinerary ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-foreground">No Itinerary Yet</h3>
            <p className="mt-2 text-muted-foreground">
              Let AI create a personalized itinerary for your trip
            </p>
          </div>
          <Button
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
            size="lg"
            className="btn-gradient"
          >
            {isGenerating ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your Itinerary</h3>
            <Button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingId(null);
                setFormData({ day: 1, title: '', description: '', time: '09:00', location: '', category: 'Sightseeing' });
              }}
              size="sm"
              className="btn-gradient"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>

          {showAddForm && (
            <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="grid gap-3">
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                  className="rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm text-foreground"
                >
                  {days.map(d => <option key={d} value={d}>Day {d}</option>)}
                </select>
                <Input
                  placeholder="Activity title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-primary/30 bg-white"
                />
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="border-primary/30 bg-white"
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="border-primary/30 bg-white"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm text-foreground"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddActivity} className="btn-gradient flex-1">
                  {editingId ? 'Update' : 'Add'} Activity
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  variant="outline"
                  className="border-primary/30"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {days.map(day => (
            <div key={day} className="space-y-3">
              <h4 className="font-semibold text-primary">Day {day}</h4>
              {groupedByDay[day]?.length > 0 ? (
                <div className="space-y-2">
                  {groupedByDay[day].map(activity => (
                    <div
                      key={activity.id}
                      className="rounded-lg border border-primary/30 bg-white p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{activity.title}</h5>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {activity.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              {activity.location}
                            </div>
                            {activity.description && (
                              <p className="mt-2 text-muted-foreground">{activity.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No activities planned for this day</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
