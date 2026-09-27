import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, CalendarCheck, TrendingUp, Activity } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const [usersCount, propertiesCount, bookingsCount, recentBookings, activeProperties, revenueData] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.booking.count(),
    db.booking.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { property: true, guest: true }
    }),
    db.property.count({ where: { status: 'ACTIVE' } }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'CONFIRMED' }
    })
  ]);

  const totalRevenue = revenueData._sum.totalPrice ? Number(revenueData._sum.totalPrice) : 0;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="w-8 h-8 text-[#FF5A5F]" />
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Platform Admin</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Users</p>
              <p className="text-3xl font-black text-stone-800">{usersCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Active Listings</p>
              <p className="text-3xl font-black text-stone-800">{activeProperties} <span className="text-lg font-medium text-stone-400">/ {propertiesCount}</span></p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Bookings</p>
              <p className="text-3xl font-black text-stone-800">{bookingsCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-stone-800">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-800 mb-6">Recent Platform Activity</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-4 pl-6 font-semibold text-stone-500 text-sm uppercase tracking-wider">Property</th>
                  <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Guest</th>
                  <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Dates</th>
                  <th className="p-4 font-semibold text-stone-500 text-sm uppercase tracking-wider">Revenue</th>
                  <th className="p-4 pr-6 font-semibold text-stone-500 text-sm uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 pl-6 font-medium text-stone-800">
                      <Link href={`/properties/${booking.property.id}`} className="hover:text-[#FF5A5F] hover:underline truncate block max-w-[250px]">
                        {booking.property.title}
                      </Link>
                    </td>
                    <td className="p-4 text-stone-600">
                      <p className="font-medium">{booking.guest.name}</p>
                      <p className="text-xs text-stone-400">{booking.guest.email}</p>
                    </td>
                    <td className="p-4 text-stone-600 text-sm">
                      {booking.checkIn.toLocaleDateString()} &rarr; {booking.checkOut.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-stone-800 font-semibold">${booking.totalPrice.toString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-500 font-medium">No bookings on the platform yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
