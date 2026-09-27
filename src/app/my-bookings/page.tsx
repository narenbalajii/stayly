import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CalendarDays, Receipt, Luggage } from 'lucide-react';
import { CancelBookingButton } from '@/components/CancelBookingButton';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmed', className: 'bg-green-100 text-green-700 border-green-200' },
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-600 border-red-200' },
  COMPLETED: { label: 'Completed', className: 'bg-blue-100 text-blue-700 border-blue-200' },
} as const;

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
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">My Trips</h1>
          <p className="text-stone-500 mt-2">{bookings.length} {bookings.length === 1 ? 'trip' : 'trips'} total</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-12 md:p-16 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Luggage className="w-12 h-12 text-stone-300" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">No trips booked... yet!</h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto text-base">
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-[#FF5A5F] text-white font-bold px-8 py-3 rounded-full hover:bg-[#E0484D] transition shadow-md"
            >
              Browse stays
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => {
              const status = booking.status as keyof typeof STATUS_CONFIG;
              const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
              const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

              const checkIn = new Date(booking.checkIn);
              const checkOut = new Date(booking.checkOut);
              const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={booking.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row hover:shadow-md transition">
                  {/* Image */}
                  <div className="w-full md:w-64 h-52 md:h-auto bg-stone-200 relative flex-shrink-0">
                    {booking.property.images[0] ? (
                      <img
                        src={booking.property.images[0].imageUrl}
                        alt={booking.property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-400 text-sm">No image</div>
                    )}
                    {/* Status badge on image for mobile */}
                    <span className={`absolute top-3 left-3 md:hidden px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold text-stone-800 line-clamp-1 flex-1 mr-4">{booking.property.title}</h2>
                        <span className={`hidden md:inline-flex px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider flex-shrink-0 ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-stone-500 font-medium mb-5 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.property.location}
                      </p>

                      {/* Booking info grid */}
                      <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100 text-sm">
                        <div>
                          <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Check-in</span>
                          <div className="font-semibold text-stone-800">
                            {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Check-out</span>
                          <div className="font-semibold text-stone-800">
                            {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total</span>
                          <div className="font-semibold text-stone-800 flex items-center gap-1">
                            <Receipt className="w-3.5 h-3.5 text-stone-400" />
                            ${Number(booking.totalPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-stone-400 mt-2">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/properties/${booking.property.id}`}
                        className="text-sm font-semibold text-stone-800 bg-white border border-stone-300 px-5 py-2.5 rounded-lg hover:bg-stone-50 transition"
                      >
                        View property
                      </Link>
                      {canCancel && <CancelBookingButton bookingId={booking.id} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
