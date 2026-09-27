import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, CalendarCheck, TrendingUp, Activity, UserCheck, UserCog, XCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();

  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const [
    usersCount,
    propertiesCount,
    bookingsCount,
    recentBookings,
    activeProperties,
    revenueData,
    hostsCount,
    cancelledBookings,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.booking.count(),
    db.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { property: true, guest: true }
    }),
    db.property.count({ where: { status: 'ACTIVE' } }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'CONFIRMED' }
    }),
    db.user.count({ where: { role: 'HOST' } }),
    db.booking.count({ where: { status: 'CANCELLED' } }),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    }),
  ]);

  const totalRevenue = revenueData._sum.totalPrice ? Number(revenueData._sum.totalPrice) : 0;
  const guestsCount = usersCount - hostsCount - 1; // subtract admin

  const STATUS_CONFIG = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-600',
    COMPLETED: 'bg-blue-100 text-blue-700',
  } as const;

  const ROLE_CONFIG = {
    ADMIN: 'bg-purple-100 text-purple-700',
    HOST: 'bg-orange-100 text-orange-700',
    GUEST: 'bg-stone-100 text-stone-600',
  } as const;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Platform Admin</h1>
            <p className="text-stone-500 text-sm">Overview of all platform activity</p>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Users</p>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-stone-800">{usersCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Properties</p>
              <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                <Home className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-stone-800">{activeProperties}</p>
            <p className="text-xs text-stone-400 mt-1">of {propertiesCount} total active</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Bookings</p>
              <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-stone-800">{bookingsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Revenue</p>
              <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-800">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-stone-400 mt-1">confirmed only</p>
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <UserCog className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hosts</p>
              <p className="text-2xl font-black text-stone-800">{hostsCount}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Guests</p>
              <p className="text-2xl font-black text-stone-800">{Math.max(0, guestsCount)}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Props</p>
              <p className="text-2xl font-black text-stone-800">{activeProperties}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Cancelled</p>
              <p className="text-2xl font-black text-stone-800">{cancelledBookings}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-stone-800 mb-5">Recent Platform Bookings</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
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
                      <td className="p-4 pl-6 font-medium text-stone-800 text-sm">
                        <Link href={`/properties/${booking.property.id}`} className="hover:text-[#FF5A5F] transition truncate block max-w-[220px]">
                          {booking.property.title}
                        </Link>
                      </td>
                      <td className="p-4 text-sm">
                        <p className="font-medium text-stone-700">{booking.guest.name}</p>
                        <p className="text-xs text-stone-400">{booking.guest.email}</p>
                      </td>
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

        {/* Recent Users */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-5">Recent Users</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="p-4 pl-6 font-semibold text-stone-500 text-xs uppercase tracking-wider">User</th>
                    <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Email</th>
                    <th className="p-4 font-semibold text-stone-500 text-xs uppercase tracking-wider">Joined</th>
                    <th className="p-4 pr-6 font-semibold text-stone-500 text-xs uppercase tracking-wider text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-stone-800 text-sm">{user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600 text-sm">{user.email}</td>
                      <td className="p-4 text-stone-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG] || 'bg-stone-100 text-stone-600'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
