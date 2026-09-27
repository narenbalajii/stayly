'use client';

import Link from 'next/link';
import { User, LogOut, Menu, Home, Calendar } from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // @ts-ignore
  const role = session?.user?.role as string | undefined;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black text-[#FF5A5F] tracking-tighter hover:opacity-90 transition">
              stayly.
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-stone-600 font-medium hover:text-[#FF5A5F] transition">
              Browse
            </Link>
            
            {session?.user && (
              <Link href="/my-bookings" className="text-stone-600 font-medium hover:text-[#FF5A5F] transition">
                My Bookings
              </Link>
            )}

            {role === 'HOST' && (
              <Link href="/host" className="text-stone-600 font-medium hover:text-[#FF5A5F] transition">
                Host Dashboard
              </Link>
            )}
            
            {role === 'ADMIN' && (
              <Link href="/admin" className="text-stone-600 font-medium hover:text-[#FF5A5F] transition">
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!session?.user ? (
              <>
                <Link href="/login" className="text-stone-600 font-medium hover:text-stone-900 transition">
                  Log in
                </Link>
                <Link href="/signup" className="bg-[#FF5A5F] hover:bg-[#E0484D] text-white px-5 py-2.5 rounded-full font-semibold transition shadow-sm">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-3 border border-stone-300 p-2 pl-4 rounded-full hover:shadow-md transition bg-white">
                  <Menu className="w-4 h-4 text-stone-600" />
                  <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                    <User className="w-5 h-5" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right">
                  <div className="p-4 border-b border-stone-100">
                    <p className="font-semibold text-stone-800 truncate">{session.user.name || 'User'}</p>
                    <p className="text-xs text-stone-500 truncate">{session.user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link href="/my-bookings" className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 text-stone-700 transition">
                      <Calendar className="w-4 h-4" /> Trips
                    </Link>
                    <Link href="/host" className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 text-stone-700 transition">
                      <Home className="w-4 h-4" /> Manage listings
                    </Link>
                  </div>
                  <div className="py-2 border-t border-stone-100">
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-6 py-4 shadow-lg absolute w-full left-0 top-20">
          <div className="flex flex-col gap-4">
            <Link href="/properties" onClick={() => setIsMenuOpen(false)} className="text-stone-800 font-medium py-2 border-b border-stone-100">Browse Stays</Link>
            
            {!session?.user ? (
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/login" className="text-stone-800 font-medium py-2 text-center border border-stone-300 rounded-xl">Log in</Link>
                <Link href="/signup" className="bg-[#FF5A5F] text-white font-medium py-2 text-center rounded-xl">Sign up</Link>
              </div>
            ) : (
              <>
                <Link href="/my-bookings" onClick={() => setIsMenuOpen(false)} className="text-stone-800 font-medium py-2 border-b border-stone-100">My Bookings</Link>
                {role === 'HOST' && (
                  <Link href="/host" onClick={() => setIsMenuOpen(false)} className="text-stone-800 font-medium py-2 border-b border-stone-100">Host Dashboard</Link>
                )}
                {role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-stone-800 font-medium py-2 border-b border-stone-100">Admin Panel</Link>
                )}
                <button onClick={() => signOut()} className="text-red-600 font-medium py-2 text-left">Log out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
