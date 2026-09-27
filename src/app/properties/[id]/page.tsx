import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { createBooking } from '@/lib/booking-actions';
import { MapPin, Users, Home, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await db.property.findUnique({
    where: { id: params.id },
    include: { images: true, host: true }
  });

  if (!property || property.status === 'INACTIVE') {
    notFound();
  }

  const session = await auth();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav spacing */}
      <div className="pt-8 px-6 max-w-7xl mx-auto">
        <Link href="/properties" className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-stone-900 mb-6 group">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to search
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{property.title}</h1>
        <div className="flex items-center gap-4 text-stone-600 font-medium text-sm mb-6 pb-6 border-b border-stone-200">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {property.location}</span>
          <span className="underline cursor-pointer">{property.type}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden">
          <div className="h-full w-full bg-stone-200">
            {property.images[0] ? (
              <img 
                src={property.images[0].imageUrl} 
                alt="Main view"
                className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-stone-400">No images</div>
            )}
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <div className="h-full w-full bg-stone-200 overflow-hidden">
              {property.images[1] ? (
                <img src={property.images[1].imageUrl} alt="View 2" className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-stone-400 bg-stone-100"></div>
              )}
            </div>
            <div className="h-full w-full bg-stone-200 overflow-hidden">
              {property.images[2] ? (
                <img src={property.images[2].imageUrl} alt="View 3" className="object-cover w-full h-full hover:scale-105 transition duration-700 cursor-pointer" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-stone-400 bg-stone-100"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto pb-24 flex flex-col md:flex-row gap-16">
        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start pb-8 border-b border-stone-200">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Hosted by {property.host.name || 'Anonymous'}
              </h2>
              <ul className="flex items-center gap-4 text-stone-500 font-medium">
                <li className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> {property.maxGuests} guests</li>
                <li className="flex items-center"><Home className="w-4 h-4 mr-1.5" /> {property.type}</li>
              </ul>
            </div>
            <div className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center text-xl font-bold text-stone-500">
              {property.host.name?.charAt(0) || 'H'}
            </div>
          </div>
          
          <div className="py-8 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-4">About this space</h2>
            <p className="text-stone-600 whitespace-pre-wrap leading-relaxed text-lg">
              {property.description}
            </p>
          </div>

          <div className="py-8 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-6">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-stone-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-stone-400" />
                    {amenity}
                  </div>
                ))
              ) : (
                <p className="text-stone-500">No specific amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="w-full md:w-[400px] flex-shrink-0">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl sticky top-28">
            <div className="mb-6">
              <span className="text-3xl font-bold text-stone-800">${property.pricePerNight.toString()}</span>
              <span className="text-lg font-medium text-stone-500 ml-1">night</span>
            </div>
            
            <form action={createBooking} className="space-y-4">
              <input type="hidden" name="propertyId" value={property.id} />
              <div className="border border-stone-300 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 border-b border-stone-300">
                  <div className="p-3 border-r border-stone-300">
                    <label className="block text-[10px] font-bold uppercase text-stone-800 tracking-wider">Check-in</label>
                    <input type="date" name="checkIn" required className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer" />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase text-stone-800 tracking-wider">Check-out</label>
                    <input type="date" name="checkOut" required className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer" />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase text-stone-800 tracking-wider">Guests</label>
                  <select name="guests" className="w-full mt-1 text-sm outline-none bg-transparent cursor-pointer">
                    {Array.from({ length: property.maxGuests }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {session?.user ? (
                <button type="submit" className="w-full bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md active:scale-[0.98]">
                  Reserve
                </button>
              ) : (
                <a href="/login" className="block text-center w-full bg-stone-800 text-white font-bold py-4 rounded-xl hover:bg-stone-900 transition shadow-md">
                  Log in to reserve
                </a>
              )}
            </form>
            <p className="text-center text-sm text-stone-500 mt-4">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
