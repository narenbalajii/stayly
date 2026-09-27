import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { createBooking } from '@/lib/booking-actions';
import { MapPin, Users, Home, CheckCircle2, ChevronLeft, Wifi, Waves, Mountain, Car, Wind, Flame, Tv, Dumbbell, UtensilsCrossed, Trees } from 'lucide-react';
import Link from 'next/link';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-5 h-5" />,
  'Pool': <Waves className="w-5 h-5" />,
  'Mountain view': <Mountain className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Air Conditioning': <Wind className="w-5 h-5" />,
  'Fireplace': <Flame className="w-5 h-5" />,
  'TV': <Tv className="w-5 h-5" />,
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Kitchen': <UtensilsCrossed className="w-5 h-5" />,
  'Garden': <Trees className="w-5 h-5" />,
};

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const property = await db.property.findUnique({
    where: { id },
    include: { images: true, host: true }
  });

  if (!property || property.status === 'INACTIVE') {
    notFound();
  }

  const session = await auth();

  const msPerDay = 1000 * 60 * 60 * 24;
  const pricePerNight = Number(property.pricePerNight);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8 px-6 max-w-7xl mx-auto">
        <Link href="/properties" className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-stone-900 mb-6 group transition">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to search
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-stone-600 font-medium text-sm mb-6 pb-6 border-b border-stone-200">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#FF5A5F]" /> {property.location}</span>
          <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-600 border border-stone-200">{property.type}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Up to {property.maxGuests} guests</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[55vh] rounded-2xl overflow-hidden">
          {/* Large left image */}
          <div className="h-full w-full bg-stone-200 overflow-hidden rounded-l-2xl md:rounded-none md:rounded-l-2xl">
            {property.images[0] ? (
              <img
                src={property.images[0].imageUrl}
                alt="Main view"
                className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-stone-400 text-sm">No images</div>
            )}
          </div>
          {/* Two stacked right images */}
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <div className="h-full w-full bg-stone-100 overflow-hidden rounded-tr-2xl">
              {property.images[1] ? (
                <img src={property.images[1].imageUrl} alt="View 2" className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-stone-100 text-stone-300 text-sm">No image</div>
              )}
            </div>
            <div className="h-full w-full bg-stone-100 overflow-hidden rounded-br-2xl relative">
              {property.images[2] ? (
                <img src={property.images[2].imageUrl} alt="View 3" className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-stone-100 text-stone-300 text-sm">No image</div>
              )}
              {property.images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-black/50 transition">
                  +{property.images.length - 3} photos
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto pb-24 flex flex-col md:flex-row gap-16">
        {/* Main Content */}
        <div className="flex-grow min-w-0">
          {/* Host section */}
          <div className="flex justify-between items-center pb-8 border-b border-stone-200">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-1">
                Hosted by {property.host.name || 'Anonymous'}
              </h2>
              <ul className="flex flex-wrap items-center gap-4 text-stone-500 font-medium text-sm">
                <li className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {property.maxGuests} guests max</li>
                <li className="flex items-center gap-1.5"><Home className="w-4 h-4" /> {property.type}</li>
                <li className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {property.location}</li>
              </ul>
            </div>
            <div className="w-14 h-14 bg-[#FF5A5F] rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-md">
              {property.host.name?.charAt(0).toUpperCase() || 'H'}
            </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-4">About this space</h2>
            <p className="text-stone-600 whitespace-pre-wrap leading-relaxed text-base">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="py-8 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-6">What this place offers</h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 font-medium">
                    <span className="text-[#FF5A5F] flex-shrink-0">
                      {AMENITY_ICONS[amenity] || <CheckCircle2 className="w-5 h-5 text-stone-400" />}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500">No specific amenities listed.</p>
            )}
          </div>

          {/* Location */}
          <div className="py-8">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Location</h2>
            <div className="flex items-center gap-2 text-stone-600 font-medium">
              <MapPin className="w-5 h-5 text-[#FF5A5F]" />
              {property.location}
            </div>
          </div>
        </div>

        {/* Booking Card — sticky on desktop */}
        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl sticky top-28">
            <div className="mb-5 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-stone-900">${pricePerNight.toLocaleString()}</span>
              <span className="text-base font-medium text-stone-500">/ night</span>
            </div>

            <form action={createBooking} className="space-y-4">
              <input type="hidden" name="propertyId" value={property.id} />
              <div className="border border-stone-300 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 border-b border-stone-300">
                  <div className="p-3 border-r border-stone-300">
                    <label className="block text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1">Check-in</label>
                    <input
                      type="date"
                      name="checkIn"
                      required
                      className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer text-stone-800 font-medium"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1">Check-out</label>
                    <input
                      type="date"
                      name="checkOut"
                      required
                      className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer text-stone-800 font-medium"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase text-stone-600 tracking-wider mb-1">Guests</label>
                  <select name="guests" className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer text-stone-800 font-medium">
                    {Array.from({ length: property.maxGuests }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {session?.user ? (
                <button type="submit" className="w-full bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md active:scale-[0.98] text-base">
                  Reserve
                </button>
              ) : (
                <a href="/login" className="block text-center w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition shadow-md text-base">
                  Log in to reserve
                </a>
              )}
            </form>

            <p className="text-center text-sm text-stone-400 mt-3">You won't be charged yet</p>

            {/* Pricing breakdown hint */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>${pricePerNight.toLocaleString()} × nights</span>
                <span className="text-stone-400">See total after selecting dates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating booking bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-stone-200 px-6 py-4 flex items-center justify-between z-50 shadow-2xl">
        <div>
          <span className="text-xl font-bold text-stone-900">${pricePerNight.toLocaleString()}</span>
          <span className="text-stone-500 text-sm"> / night</span>
        </div>
        <a href="#booking-card" className="bg-[#FF5A5F] text-white font-bold px-8 py-3 rounded-full hover:bg-[#E0484D] transition shadow-md">
          Reserve
        </a>
      </div>
    </div>
  );
}
