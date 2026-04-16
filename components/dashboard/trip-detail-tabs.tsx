'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItineraryTab } from './tabs/itinerary-tab';
import { BudgetTab } from './tabs/budget-tab';
import { MemoriesTab } from './tabs/memories-tab';
import { ChatTab } from './tabs/chat-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import { CollaborationTab } from './tabs/collaboration-tab';
import { MapPin, DollarSign, Image, MessageSquare, Star, Users } from 'lucide-react';

interface TripDetailTabsProps {
  trip: any;
}

export function TripDetailTabs({ trip }: TripDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white border border-primary/30 rounded-lg p-1">
        <TabsTrigger value="itinerary" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Itinerary</span>
        </TabsTrigger>
        <TabsTrigger value="budget" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Budget</span>
        </TabsTrigger>
        <TabsTrigger value="memories" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Memories</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Reviews</span>
        </TabsTrigger>
        <TabsTrigger value="collaboration" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Team</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Chat</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="itinerary" className="mt-6">
        <ItineraryTab trip={trip} />
      </TabsContent>

      <TabsContent value="budget" className="mt-6">
        <BudgetTab trip={trip} />
      </TabsContent>

      <TabsContent value="memories" className="mt-6">
        <MemoriesTab trip={trip} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <ReviewsTab trip={trip} />
      </TabsContent>

      <TabsContent value="collaboration" className="mt-6">
        <CollaborationTab trip={trip} />
      </TabsContent>

      <TabsContent value="chat" className="mt-6">
        <ChatTab trip={trip} />
      </TabsContent>
    </Tabs>
  );
}
