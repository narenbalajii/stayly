import { db } from '@/lib/db';
import Link from 'next/link';
import { PropertyCard } from '@/components/PropertyCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    location?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    guests?: string;
  }>;
}

export default async function PropertiesPage(props: Props) {
  const searchParams = await props.searchParams;
  const { location, type, minPrice, maxPrice, guests } = searchParams;

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

  if (guests) {
    where.maxGuests = { gte: parseInt(guests) };
  }

  const properties = await db.property.findMany({
    where,
    include: { images: true, host: true },
    orderBy: { createdAt: 'desc' }
  });

  const hasFilters = !!(location || type || minPrice || maxPrice || guests);

  const activeFilters: { label: string; removeKey: string }[] = [];
  if (location) activeFilters.push({ label: `Location: ${location}`, removeKey: 'location' });
  if (type) activeFilters.push({ label: `Type: ${type}`, removeKey: 'type' });
  if (minPrice) activeFilters.push({ label: `Min: $${minPrice}`, removeKey: 'minPrice' });
  if (maxPrice) activeFilters.push({ label: `Max: $${maxPrice}`, removeKey: 'maxPrice' });
  if (guests) activeFilters.push({ label: `${guests}+ guests`, removeKey: 'guests' });

  function buildRemoveUrl(key: string) {
    const params = new URLSearchParams();
    if (location && key !== 'location') params.set('location', location);
    if (type && key !== 'type') params.set('type', type);
    if (minPrice && key !== 'minPrice') params.set('minPrice', minPrice);
    if (maxPrice && key !== 'maxPrice') params.set('maxPrice', maxPrice);
    if (guests && key !== 'guests') params.set('guests', guests);
    const qs = params.toString();
    return `/properties${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="sticky top-20 z-40 bg-white border-b border-stone-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <form className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:pb-0">
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
              name="minPrice" 
              defaultValue={minPrice || ''}
              placeholder="Min Price" 
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 w-28 min-w-[100px]"
            />
            <input 
              type="number" 
              name="maxPrice" 
              defaultValue={maxPrice || ''}
              placeholder="Max Price" 
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 w-28 min-w-[100px]"
            />
            <input 
              type="number" 
              name="guests" 
              defaultValue={guests || ''}
              placeholder="Guests" 
              className="px-4 py-2 bg-stone-100 rounded-full text-sm font-medium focus:outline-none border border-transparent focus:border-stone-300 w-28 min-w-[100px]"
            />
            <button type="submit" className="bg-[#FF5A5F] text-white p-2.5 px-6 rounded-full hover:bg-[#E0484D] transition flex items-center gap-2 flex-shrink-0 font-bold text-sm">
              <Search className="w-4 h-4" /> Search
            </button>
          </form>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">Active Filters:</span>
              {activeFilters.map((filter) => (
                <Link
                  key={filter.removeKey}
                  href={buildRemoveUrl(filter.removeKey)}
                  className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-stone-200 transition group border border-stone-200"
                >
                  {filter.label}
                  <X className="w-3 h-3 opacity-50 group-hover:opacity-100 text-stone-500" />
                </Link>
              ))}
              <Link
                href="/properties"
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline ml-2 transition"
              >
                Clear all
              </Link>
            </div>
          )}
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
            <div className="text-center py-24 text-stone-500 bg-stone-50 rounded-3xl border border-stone-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-stone-300 mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">No stays found</h3>
              <p className="max-w-md mb-8">Try changing or removing some of your filters or adjusting your search area to find the perfect stay.</p>
              <Link href="/properties" className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition shadow-sm">
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
