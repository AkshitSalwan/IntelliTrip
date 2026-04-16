'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
}

export function TripCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  image,
}: TripCardProps) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    <Link href={`/dashboard/trips/${id}`}>
      <div className="group overflow-hidden rounded-2xl border border-primary/30 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23cffafe" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2306b6d4"%3ENo image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" />
              <span>{destination}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
