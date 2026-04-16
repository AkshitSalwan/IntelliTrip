'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Upload, Trash2, Loader } from 'lucide-react';

interface Memory {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

interface MemoriesTabProps {
  trip: any;
}

export function MemoriesTab({ trip }: MemoriesTabProps) {
  const [memories, setMemories] = useState<Memory[]>(trip.memories || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/trips/${trip._id}/memories`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newMemory = await response.json();
          setMemories((prev) => [newMemory, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error uploading memory:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveMemory = async (id: string) => {
    try {
      await fetch(`/api/trips/${trip._id}/memories/${id}`, {
        method: 'DELETE',
      });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error removing memory:', error);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-purple-200/50 bg-linear-to-br from-white to-pink-50/30 p-6">
      {/* Upload Button */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-purple-900">Trip Memories</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-300/50 bg-linear-to-br from-pink-100/20 to-purple-100/20 p-8 transition-all hover:border-pink-400/70 hover:bg-linear-to-br hover:from-pink-100/40 hover:to-purple-100/40 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader className="mb-2 h-8 w-8 animate-spin text-purple-500" />
              <span className="text-sm text-purple-600">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-purple-400" />
              <span className="font-medium text-purple-900">Click to upload photos</span>
              <span className="text-sm text-purple-600/70">or drag and drop</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Gallery */}
      {memories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-300/50 bg-purple-50/30 py-12 text-center">
          <p className="text-purple-600/70">No memories yet. Upload your first photo!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {memories.map((memory) => (
            <div key={memory.id} className="group relative overflow-hidden rounded-2xl border border-purple-200/50 shadow-sm hover:shadow-md transition-all">
              <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-pink-200 to-purple-200">
                <Image
                  src={memory.url}
                  alt={memory.caption || 'Trip memory'}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              {memory.caption && (
                <div className="bg-white/60 backdrop-blur-sm p-2 text-xs text-purple-900">
                  {memory.caption}
                </div>
              )}
              <button
                onClick={() => handleRemoveMemory(memory.id)}
                className="absolute right-2 top-2 hidden rounded-full bg-white/70 backdrop-blur-sm p-2 text-red-500 transition-colors hover:bg-white group-hover:block"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
