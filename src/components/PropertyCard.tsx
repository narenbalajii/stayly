import Link from 'next/link';
import { Heart } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  type: string;
  pricePerNight: number;
  imageUrl?: string;
  hostName?: string;
}

export function PropertyCard({ id, title, location, type, pricePerNight, imageUrl, hostName }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`} className="group block">
      <div className="flex flex-col gap-3">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-400 bg-stone-200">
              No image
            </div>
          )}
          {/* Favorite Button (Visual only) */}
          <button 
            className="absolute right-3 top-3 p-2 rounded-full text-white/90 hover:scale-110 transition active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              // Prevent default so the link doesn't trigger when liking
            }}
          >
            <Heart className="h-6 w-6 stroke-white stroke-2 drop-shadow-md" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-stone-800 line-clamp-1">{location}</h3>
            <span className="flex items-center gap-1 text-sm text-stone-700">
              <span className="text-stone-500 text-xs px-2 py-0.5 bg-stone-100 rounded-full border border-stone-200">{type}</span>
            </span>
          </div>
          <p className="text-stone-500 text-sm line-clamp-1">{title}</p>
          {hostName && <p className="text-stone-500 text-sm">Hosted by {hostName}</p>}
          
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-semibold text-stone-900">${pricePerNight}</span>
            <span className="text-stone-500 text-sm">night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
