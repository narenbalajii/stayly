import { db } from '@/lib/db';
import Link from 'next/link';
import { PropertyCard } from '@/components/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  searchParams: {
    location?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function PropertiesPage({ searchParams }: Props) {
  const { location, type, minPrice, maxPrice } = searchParams;

  const where: any = { status: 'ACTIVE' };
  
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }
  
  if (type) {
    where.type = type;
  }

  if (minPrice || maxPrice) {
    where.pricePerNight = {};
    if (minPrice) where.pricePerNight.gte = Number(minPrice);
    if (maxPrice) where.pricePerNight.lte = Number(maxPrice);
  }

  const properties = await db.property.findMany({
    where,
    include: { images: true, host: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="sticky top-20 z-40 bg-white border-b border-stone-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <form className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <input 
              type="text" 
              name="location" 
              defaultValue={location || ''}
              placeholder="Location" 
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 min-w-[120px]"
            />
            <select 
              name="type" 
              defaultValue={type || ''}
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 cursor-pointer min-w-[120px]"
            >
              <option value="">Any Type</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Luxury stay">Luxury stay</option>
              <option value="Beach stay">Beach stay</option>
              <option value="Mountain stay">Mountain stay</option>
            </select>
            <input 
              type="number" 
              name="maxPrice" 
              defaultValue={maxPrice || ''}
              placeholder="Max Price" 
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 w-32 min-w-[100px]"
            />
            <button type="submit" className="bg-stone-900 text-white p-2.5 rounded-full hover:bg-stone-800 transition flex-shrink-0">
              <Search className="w-4 h-4" />
            </button>
          </form>
          
          <div className="hidden md:flex items-center gap-2 text-stone-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-end">
            <h1 className="text-3xl font-bold text-stone-800">
              {location ? `Stays in ${location}` : 'All Properties'}
            </h1>
            <p className="text-stone-500 font-medium">
              {properties.length} {properties.length === 1 ? 'stay' : 'stays'}
            </p>
          </div>
          
          {properties.length === 0 ? (
            <div className="text-center py-24 text-stone-500 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center">
              <Search className="w-12 h-12 text-stone-300 mb-4" />
              <h3 className="text-xl font-semibold text-stone-800 mb-2">No exact matches</h3>
              <p className="max-w-md">Try changing or removing some of your filters or adjusting your search area.</p>
              <Link href="/properties" className="mt-6 border border-stone-300 text-stone-800 px-6 py-2 rounded-full font-medium hover:bg-stone-100 transition">
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  type={property.type}
                  pricePerNight={Number(property.pricePerNight)}
                  imageUrl={property.images[0]?.imageUrl}
                  hostName={property.host.name || 'Stayly Host'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
