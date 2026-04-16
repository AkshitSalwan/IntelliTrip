'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Plus, Trash2, Edit2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  description: string;
  date: string;
}

interface ReviewsTabProps {
  trip: any;
}

export function ReviewsTab({ trip }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>(trip.reviews || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    description: '',
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleAddReview = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingId) {
      setReviews(
        reviews.map(r =>
          r.id === editingId
            ? { ...r, ...formData, date: r.date }
            : r
        )
      );
      setEditingId(null);
    } else {
      setReviews([
        ...reviews,
        {
          id: Date.now().toString(),
          ...formData,
          date: new Date().toLocaleDateString(),
        },
      ]);
    }

    setFormData({ rating: 5, title: '', description: '' });
    setShowForm(false);
  };

  const handleEditReview = (review: Review) => {
    setFormData({
      rating: review.rating,
      title: review.title,
      description: review.description,
    });
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const StarRating = ({ rating, onRatingChange }: any) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onRatingChange?.(star)}
          type="button"
          className="transition-colors"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 rounded-2xl border border-teal-200/50 bg-gradient-to-br from-white to-cyan-50/20 p-6">
      {/* Overall Rating */}
      {reviews.length > 0 && (
        <div className="rounded-lg border border-teal-200/50 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">Overall Trip Rating</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-slate-900">{averageRating}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(parseFloat(averageRating as string))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
        </div>
      )}

      {/* Add Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          {reviews.length === 0 ? 'Share Your Experience' : 'Reviews'}
        </h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ rating: 5, title: '', description: '' });
          }}
          size="sm"
          className={showForm ? 'border-teal-200/50 bg-white text-teal-700' : 'btn-gradient'}
          variant={showForm ? 'outline' : 'default'}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="space-y-4 rounded-xl border border-teal-200/50 bg-cyan-50/30 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Rating</label>
            <StarRating rating={formData.rating} onRatingChange={(rating: number) => setFormData({ ...formData, rating })} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">Title</label>
            <Input
              placeholder="e.g., Amazing trip!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 border-teal-200/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">Review</label>
            <textarea
              placeholder="Share your thoughts about the trip..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-teal-200/50 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddReview} className="btn-gradient flex-1">
              {editingId ? 'Update' : 'Post'} Review
            </Button>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              variant="outline"
              className="border-teal-200/50"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-center text-slate-500/70 py-8 italic">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div
              key={review.id}
              className="rounded-lg border border-teal-200/50 bg-white p-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">{review.date}</span>
                  </div>
                  <h5 className="mt-2 font-medium text-slate-900">{review.title}</h5>
                  <p className="mt-1 text-sm text-slate-700">{review.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
