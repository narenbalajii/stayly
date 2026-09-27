import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { createBooking } from '@/lib/booking-actions';

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
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        
        {/* Image Gallery */}
        <div className="w-full aspect-[2/1] md:aspect-[3/1] bg-stone-200 relative">
          {property.images[0] ? (
            <img 
              src={property.images[0].imageUrl} 
              alt={property.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-stone-400">
              No images available
            </div>
          )}
        </div>

        <div className="p-8 md:flex gap-12">
          {/* Main Info */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">{property.title}</h1>
            <p className="text-lg text-stone-500 mb-6">{property.location}</p>
            
            <div className="border-t border-b border-stone-100 py-6 mb-6">
              <p className="font-medium text-stone-800">Hosted by {property.host.name || 'Anonymous'}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-4">About this space</h2>
              <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="mt-8 md:mt-0 w-full md:w-80 flex-shrink-0">
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-lg sticky top-24">
              <div className="text-2xl font-bold text-stone-800 mb-6">
                ${property.pricePerNight.toString()} <span className="text-base font-normal text-stone-500">night</span>
              </div>
              
              <form action={createBooking} className="space-y-4">
                <input type="hidden" name="propertyId" value={property.id} />
                <div className="grid grid-cols-2 gap-2 border border-stone-300 rounded-lg p-2">
                  <div className="p-2 border-r border-stone-300">
                    <label className="block text-xs font-bold uppercase text-stone-800">Check-in</label>
                    <input type="date" name="checkIn" required className="w-full mt-1 text-sm outline-none bg-transparent" />
                  </div>
                  <div className="p-2">
                    <label className="block text-xs font-bold uppercase text-stone-800">Check-out</label>
                    <input type="date" name="checkOut" required className="w-full mt-1 text-sm outline-none bg-transparent" />
                  </div>
                </div>
                
                {session?.user ? (
                  <button type="submit" className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition">
                    Reserve
                  </button>
                ) : (
                  <a href="/login" className="block text-center w-full bg-stone-800 text-white font-semibold py-3 rounded-lg hover:bg-stone-900 transition">
                    Log in to reserve
                  </a>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
