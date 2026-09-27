import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, CalendarCheck, TrendingUp, Plus, DollarSign, MapPin } from 'lucide-react';
import { HostPropertyActions } from '@/components/HostPropertyActions';

export default async function HostDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const properties = await db.property.findMany({
    where: { hostId: session.user.id },
    include: {
      bookings: {
        include: { guest: true },
        orderBy: { createdAt: 'desc' }
      },
      images: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalBookings = properties.reduce((acc, prop) => acc + prop.bookings.length, 0);
  const confirmedBookings = properties.reduce((acc, prop) =>
    acc + prop.bookings.filter(b => b.status === 'CONFIRMED').length, 0);
  const totalRevenue = properties.reduce((acc, prop) => {
    return acc + prop.bookings
      .filter(b => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
  }, 0);
  const activeListings = properties.filter(p => p.status === 'ACTIVE').length;

  // Collect recent bookings across all properties
  const recentBookings = properties
    .flatMap(p => p.bookings.map(b => ({ ...b, property: p })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const STATUS_CONFIG = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-600',
    COMPLETED: 'bg-blue-100 text-blue-700',
  } as const;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Host Dashboard</h1>
            <p className="text-stone-500 mt-1">Welcome back, {session.user.name?.split(' ')[0] || 'Host'}</p>
          </div>
          <Link
            href="/host/properties/new"
            className="bg-[#FF5A5F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E0484D] transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create New Listing
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Earnings</p>
              <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-800">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Bookings</p>
              <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-800">{totalBookings}</p>
            <p className="text-xs text-stone-400 mt-1">{confirmedBookings} confirmed</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">My Listings</p>
              <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                <Home className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-800">{properties.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Listings</p>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-800">{activeListings}</p>
            <p className="text-xs text-stone-400 mt-1">of {properties.length} total</p>
          </div>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-stone-800 mb-5">Recent Bookings</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-4 pl-6 font-semibold text-stone-500 text-xs uppercase tracking-wider">Property</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Guest</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Dates</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Revenue</th>
                      <th className="p-4 pr-6 font-semibold text-stone-500 text-xs uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-stone-50 transition">
                        <td className="p-4 pl-6 font-medium text-stone-800 text-sm truncate max-w-[200px]">
                          <Link href={`/properties/${booking.property.id}`} className="hover:text-[#FF5A5F] transition truncate block">
                            {booking.property.title}
                          </Link>
                        </td>
                        <td className="p-4 text-stone-600 text-sm">{booking.guest.name || booking.guest.email}</td>
                        <td className="p-4 text-stone-600 text-sm">
                          {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4 font-semibold text-stone-800 text-sm">${Number(booking.totalPrice).toLocaleString()}</td>
                        <td className="p-4 pr-6 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] || 'bg-stone-100 text-stone-600'}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-5">Your Properties</h2>
          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-lg font-semibold text-stone-800 mb-2">No listings yet</p>
              <p className="text-stone-500 mb-6">Start earning by sharing your space with the world.</p>
              <Link href="/host/properties/new" className="bg-[#FF5A5F] text-white font-bold px-6 py-3 rounded-full hover:bg-[#E0484D] transition shadow-md">
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-4 pl-6 font-semibold text-stone-500 text-xs uppercase tracking-wider">Listing</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Location</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Price/Night</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Bookings</th>
                      <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="p-4 pr-6 font-semibold text-stone-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {properties.map(property => (
                      <tr key={property.id} className="hover:bg-stone-50 transition">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-10 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                              {property.images[0] && (
                                <img src={property.images[0].imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <Link href={`/properties/${property.id}`} className="font-semibold text-stone-800 hover:text-[#FF5A5F] transition truncate max-w-[180px] text-sm block">
                              {property.title}
                            </Link>
                          </div>
                        </td>
                        <td className="p-4 text-stone-600 text-sm">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{property.location}</span>
                        </td>
                        <td className="p-4 font-semibold text-stone-800 text-sm">${Number(property.pricePerNight).toLocaleString()}</td>
                        <td className="p-4 text-stone-600 text-sm">{property.bookings.length} trips</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <HostPropertyActions propertyId={property.id} currentStatus={property.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
