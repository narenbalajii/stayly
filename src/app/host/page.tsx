import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, CalendarCheck, TrendingUp, Plus } from 'lucide-react';

export default async function HostDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const properties = await db.property.findMany({
    where: { hostId: session.user.id },
    include: { bookings: true, images: true },
    orderBy: { createdAt: 'desc' }
  });

  const totalBookings = properties.reduce((acc, prop) => acc + prop.bookings.length, 0);
  const totalRevenue = properties.reduce((acc, prop) => {
    return acc + prop.bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
  }, 0);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Host Dashboard</h1>
          <Link 
            href="/host/properties/new" 
            className="bg-[#FF5A5F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E0484D] transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create New Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">My Listings</p>
              <p className="text-3xl font-black text-stone-800">{properties.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Bookings</p>
              <p className="text-3xl font-black text-stone-800">{totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Earnings</p>
              <p className="text-3xl font-black text-stone-800">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-stone-800 mb-6">Your Properties</h2>
        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center text-stone-500 flex flex-col items-center">
            <Home className="w-12 h-12 text-stone-300 mb-4" />
            <p className="text-lg font-medium text-stone-800 mb-2">You haven't listed any properties yet.</p>
            <p className="mb-6">Start earning money by sharing your space.</p>
            <Link href="/host/properties/new" className="text-[#FF5A5F] font-bold hover:underline">
              Create your first listing &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="p-4 pl-6 font-semibold text-stone-500 text-sm uppercase tracking-wider">Listing</th>
                    <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Location</th>
                    <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Price/Night</th>
                    <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Bookings</th>
                    <th className="p-4 pr-6 font-semibold text-stone-500 text-sm uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {properties.map(property => (
                    <tr key={property.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 pl-6 font-medium text-stone-800 flex items-center gap-4">
                        <div className="w-16 h-12 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                          {property.images[0] && (
                            <img src={property.images[0].imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <Link href={`/properties/${property.id}`} className="hover:text-[#FF5A5F] hover:underline truncate max-w-[200px]">
                          {property.title}
                        </Link>
                      </td>
                      <td className="p-4 text-stone-600">{property.location}</td>
                      <td className="p-4 text-stone-800 font-semibold">${property.pricePerNight.toString()}</td>
                      <td className="p-4 text-stone-600">{property.bookings.length} trips</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'}`}>
                          {property.status}
                        </span>
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
  );
}
