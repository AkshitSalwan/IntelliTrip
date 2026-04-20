'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Sparkles, Clock, MapPin, Trash2, Edit2, X, ExternalLink } from 'lucide-react';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<'title' | 'location' | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();

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

  const fetchSuggestions = async (query: string, type: 'title' | 'location') => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/trips/${trip._id}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: type === 'title' ? 'activity' : 'location',
          destination: trip.destination,
          interests: trip.interests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleInputChange = (field: 'title' | 'location', value: string) => {
    setFormData({ ...formData, [field]: value });
    setActiveField(field);

    // Clear existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Set new timeout for debounced suggestions
    suggestionTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value, field);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (activeField) {
      setFormData({ ...formData, [activeField]: suggestion });
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const openInGoogleMaps = (location: string) => {
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const fetchLocationDetails = async (location: string) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`/api/trips/${trip._id}/location-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          destination: trip.destination,
          interests: trip.interests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocationDetails(data);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
    fetchLocationDetails(location);
  };

  const groupedByDay = itinerary.reduce((acc, activity) => {
    if (!acc[activity.day]) acc[activity.day] = [];
    acc[activity.day].push(activity);
    return acc;
  }, {} as Record<number, Activity[]>);

  const days = Array.from({ length: trip.duration || 3 }, (_, i) => i + 1);

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-white to-cyan-50/20 p-6">
      {/* Two Options Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Sparkles className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Itinerary</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Let AI create a personalized itinerary based on your interests and preferences
          </p>
          <Button
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
            className="btn-gradient w-full"
          >
            {isGenerating ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              'Plan with AI'
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Plus className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Manual Planning</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Add activities manually and get AI suggestions for locations
          </p>
          <Button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({ day: 1, title: '', description: '', time: '09:00', location: '', category: 'Sightseeing' });
            }}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 w-full"
          >
            Add Activity
          </Button>
        </div>
      </div>

      {/* Add Activity Form */}
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
            <div className="relative">
              <Input
                placeholder="Activity title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onFocus={() => setActiveField('title')}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="border-primary/30 bg-white"
              />
              {showSuggestions && activeField === 'title' && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-primary/10 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onFocus={() => setActiveField('location')}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="border-primary/30 bg-white"
              />
              {showSuggestions && activeField === 'location' && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-primary/10 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

      {/* Itinerary Display */}
      {itinerary && itinerary.length > 0 && (
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
                              <button
                                onClick={() => handleLocationClick(activity.location)}
                                className="text-primary hover:text-primary/80 underline flex items-center gap-1"
                              >
                                {activity.location}
                                <ExternalLink className="h-3 w-3" />
                              </button>
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

      {/* Location Details Modal */}
      {showLocationDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-foreground">{selectedLocation}</h2>
              <button
                onClick={() => setShowLocationDetails(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Google Maps Embed */}
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaN2-2HqSM'}&q=${encodeURIComponent(selectedLocation)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Activity Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Activity Details</h3>
                    <Button
                      onClick={() => openInGoogleMaps(selectedLocation)}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>

                  {isLoadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="h-6 w-6" />
                      <span className="ml-2">Loading details...</span>
                    </div>
                  ) : locationDetails ? (
                    <div className="space-y-4">
                      {/* Price */}
                      {locationDetails.price && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-800 mb-2">💰 Estimated Cost</h4>
                          <p className="text-green-700">{locationDetails.price}</p>
                        </div>
                      )}

                      {/* Weather */}
                      {locationDetails.weather && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2">🌤️ Current Weather</h4>
                          <p className="text-blue-700">{locationDetails.weather}</p>
                        </div>
                      )}

                      {/* Food Stops */}
                      {locationDetails.foodStops && locationDetails.foodStops.length > 0 && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-medium text-orange-800 mb-2">🍽️ Nearby Food Stops</h4>
                          <ul className="space-y-1">
                            {locationDetails.foodStops.map((food: string, index: number) => (
                              <li key={index} className="text-orange-700 text-sm">• {food}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Description */}
                      {locationDetails.description && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="font-medium text-purple-800 mb-2">📝 About This Location</h4>
                          <p className="text-purple-700">{locationDetails.description}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Unable to load location details
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Sidebar */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Travel Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {locationDetails?.tips && Array.isArray(locationDetails.tips) ? (
                      locationDetails.tips.map((tip: string, index: number) => (
                        <li key={index}>• {tip}</li>
                      ))
                    ) : (
                      <>
                        <li>• Check opening hours before visiting</li>
                        <li>• Consider transportation options</li>
                        <li>• Look for local deals and discounts</li>
                        <li>• Respect local customs and etiquette</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border">
                  <h3 className="font-semibold text-foreground mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => openInGoogleMaps(selectedLocation)}
                      className="w-full btn-gradient"
                      size="sm"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedLocation + ' reviews')}`, '_blank')}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      ⭐ Read Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
