import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Host Dashboard</h1>
          <Link 
            href="/host/properties/new" 
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            + Create New Property
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h3 className="text-stone-500 font-medium mb-2">My Properties</h3>
            <p className="text-3xl font-bold text-stone-800">{properties.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h3 className="text-stone-500 font-medium mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-stone-800">{totalBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h3 className="text-stone-500 font-medium mb-2">Account Status</h3>
            <p className="text-xl font-bold text-green-600">Active Host</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-stone-800 mb-6">Your Listings</h2>
        {properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-12 text-center text-stone-500">
            You haven't listed any properties yet.
            <div className="mt-4">
              <Link href="/host/properties/new" className="text-orange-600 font-semibold hover:underline">
                Create your first listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-4 font-semibold text-stone-600">Property</th>
                  <th className="p-4 font-semibold text-stone-600">Location</th>
                  <th className="p-4 font-semibold text-stone-600">Price/Night</th>
                  <th className="p-4 font-semibold text-stone-600">Status</th>
                  <th className="p-4 font-semibold text-stone-600">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                    <td className="p-4 font-medium text-stone-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                        {property.images[0] && (
                          <img src={property.images[0].imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <Link href={`/properties/${property.id}`} className="hover:text-orange-600 hover:underline">
                        {property.title}
                      </Link>
                    </td>
                    <td className="p-4 text-stone-600">{property.location}</td>
                    <td className="p-4 text-stone-600">${property.pricePerNight.toString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4 text-stone-600">{property.bookings.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
