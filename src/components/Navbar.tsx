import Link from 'next/link';
import { auth } from '@/auth';
import { logout } from '@/lib/actions';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              Stayly
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/properties" className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium">
              Browse
            </Link>
            
            {session?.user ? (
              <>
                {/* Role-based navigation */}
                {/* @ts-ignore - custom role property */}
                {session.user.role === 'HOST' && (
                  <Link href="/host" className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium">
                    Host Dashboard
                  </Link>
                )}
                {/* @ts-ignore */}
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <Link href="/my-bookings" className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium">
                  My Bookings
                </Link>
                <form action={logout}>
                  <button className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-4 py-2 rounded-md text-sm font-medium transition">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-md text-sm font-medium transition">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
