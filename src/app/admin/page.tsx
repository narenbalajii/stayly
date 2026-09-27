import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();
  
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const [usersCount, propertiesCount, bookingsCount] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.booking.count()
  ]);

  const recentBookings = await db.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { property: true, guest: true }
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 border-t-4 border-t-blue-500">
            <h3 className="text-stone-500 font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-stone-800">{usersCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 border-t-4 border-t-orange-500">
            <h3 className="text-stone-500 font-medium mb-2">Total Properties</h3>
            <p className="text-3xl font-bold text-stone-800">{propertiesCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 border-t-4 border-t-green-500">
            <h3 className="text-stone-500 font-medium mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-stone-800">{bookingsCount}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-stone-800 mb-6">Recent Bookings (Platform-wide)</h2>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="p-4 font-semibold text-stone-600">Property</th>
                <th className="p-4 font-semibold text-stone-600">Guest</th>
                <th className="p-4 font-semibold text-stone-600">Dates</th>
                <th className="p-4 font-semibold text-stone-600">Revenue</th>
                <th className="p-4 font-semibold text-stone-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                  <td className="p-4 font-medium text-stone-800">
                    <Link href={`/properties/${booking.property.id}`} className="hover:text-orange-600 hover:underline">
                      {booking.property.title}
                    </Link>
                  </td>
                  <td className="p-4 text-stone-600">{booking.guest.name} ({booking.guest.email})</td>
                  <td className="p-4 text-stone-600 text-sm">
                    {booking.checkIn.toLocaleDateString()} &rarr; {booking.checkOut.toLocaleDateString()}
                  </td>
                  <td className="p-4 text-stone-600 font-semibold">${booking.totalPrice.toString()}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">No bookings on the platform yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
