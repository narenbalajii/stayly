'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import Link from 'next/link';

function LoginButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md disabled:opacity-70 mt-4"
    >
      {pending ? 'Logging in...' : 'Log in'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-[#FF5A5F] hover:text-[#E0484D]">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl border border-stone-100 sm:rounded-3xl sm:px-10">
          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-stone-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-stone-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-900"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg font-medium border border-red-100">
                {errorMessage}
              </div>
            )}

            <div>
              <LoginButton />
            </div>
          </form>
          
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 space-y-2 border border-stone-200">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-semibold text-stone-800">Admin</span>
                <span className="font-mono">demo.admin@stayly.demo</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-2">
                <span className="font-semibold text-stone-800">Host</span>
                <span className="font-mono">demo.host1@stayly.demo</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-stone-800">Guest</span>
                <span className="font-mono">demo.guest1@stayly.demo</span>
              </div>
              <div className="mt-4 text-center text-xs text-stone-500 font-mono bg-stone-200 rounded py-1">
                Password for all: password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
