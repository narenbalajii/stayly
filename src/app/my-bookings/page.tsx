import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CalendarDays, Receipt } from 'lucide-react';

export default async function MyBookingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const bookings = await db.booking.findMany({
    where: { guestId: session.user.id },
    include: { 
      property: {
        include: { images: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-10 tracking-tight">Trips</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-12 md:p-16 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">No trips booked... yet!</h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto text-lg">Time to dust off your bags and start planning your next adventure.</p>
            <Link href="/" className="inline-block border border-stone-800 text-stone-800 px-8 py-3 rounded-xl font-bold hover:bg-stone-50 transition">
              Start searching
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row hover:shadow-md transition">
                <div className="w-full md:w-72 h-56 md:h-auto bg-stone-200 relative flex-shrink-0">
                  {booking.property.images[0] ? (
                    <img 
                      src={booking.property.images[0].imageUrl} 
                      alt={booking.property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-400">No image</div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-stone-800 line-clamp-1">{booking.property.title}</h2>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider flex-shrink-0">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-stone-500 font-medium mb-6 flex items-center"><MapPin className="w-4 h-4 mr-1" />{booking.property.location}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <div>
                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Dates</span>
                        <div className="font-medium text-stone-800">
                          {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                          &nbsp;&rarr;&nbsp; 
                          {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Paid</span>
                        <div className="font-medium text-stone-800 flex items-center">
                          <Receipt className="w-4 h-4 mr-1" /> ${booking.totalPrice.toString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link href={`/properties/${booking.property.id}`} className="text-sm font-semibold text-stone-800 bg-white border border-stone-300 px-6 py-2.5 rounded-lg hover:bg-stone-50 transition text-center flex-1 md:flex-none">
                      View property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
