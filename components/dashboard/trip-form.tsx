'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FieldGroup,
  Field,
  FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

interface TripFormData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  interests: string[];
}

const TRAVEL_STYLES = ['Budget', 'Comfort', 'Luxury'];
const INTERESTS = [
  'Adventure',
  'Culture',
  'Food',
  'Nature',
  'History',
  'Nightlife',
  'Shopping',
  'Relaxation',
];

export function TripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    title: searchParams.get('title') || '',
    destination: searchParams.get('destination') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    budget: searchParams.get('budget') || '',
    travelStyle: searchParams.get('travelStyle') || 'Comfort',
    interests: searchParams
      .get('interests')
      ?.split(',')
      .map((value) => value.trim())
      .filter(Boolean) || [],
  });

  useEffect(() => {
    setFormData({
      title: searchParams.get('title') || '',
      destination: searchParams.get('destination') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      budget: searchParams.get('budget') || '',
      travelStyle: searchParams.get('travelStyle') || 'Comfort',
      interests: searchParams
        .get('interests')
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean) || [],
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to create trip');
      }

      const { _id } = await response.json();
      router.push(`/dashboard/trips/${_id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create trip right now.'
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Trip Title</FieldLabel>
          <Input
            name="title"
            placeholder="e.g., Summer Europe Adventure"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Destination</FieldLabel>
          <Input
            name="destination"
            placeholder="e.g., Paris, France"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </Field>
      </FieldGroup>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup>
          <Field>
            <FieldLabel>Budget (USD)</FieldLabel>
            <Input
              name="budget"
              type="number"
              placeholder="e.g., 5000"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Travel Style</FieldLabel>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-purple-200/50 bg-white px-3 py-2 text-sm text-purple-900 placeholder:text-purple-400 focus-visible:outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300/50"
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>
      </div>

      <FieldGroup>
        <FieldLabel>Interests (Select all that apply)</FieldLabel>
        <div className="grid gap-3 md:grid-cols-2">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-purple-200/50 bg-white/50 p-3 transition-all hover:bg-linear-to-r hover:from-pink-200/30 hover:to-purple-200/30 hover:border-pink-300/50"
            >
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleInterestToggle(interest)}
                className="h-4 w-4 rounded border-purple-300 accent-pink-400"
              />
              <span className="text-sm text-purple-900">{interest}</span>
            </label>
          ))}
        </div>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isLoading}
        className="btn-gradient w-full"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Creating Trip...
          </>
        ) : (
          'Create Trip'
        )}
      </Button>

      {submitError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      )}
    </form>
  );
}
