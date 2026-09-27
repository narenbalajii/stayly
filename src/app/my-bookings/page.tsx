import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">My Trips</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-12 text-center">
            <h2 className="text-xl font-bold text-stone-800 mb-2">No trips booked... yet!</h2>
            <p className="text-stone-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
            <Link href="/" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Start searching
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 bg-stone-200 relative flex-shrink-0">
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
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-xl font-bold text-stone-800 mb-1">{booking.property.title}</h2>
                    <p className="text-stone-500 text-sm mb-4">{booking.property.location}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-stone-700">
                      <div>
                        <span className="block text-xs font-bold text-stone-400 uppercase">Check-in</span>
                        {booking.checkIn.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-stone-400 uppercase">Check-out</span>
                        {booking.checkOut.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-stone-400 uppercase">Total Paid</span>
                        ${booking.totalPrice.toString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 self-start">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {booking.status}
                    </span>
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
