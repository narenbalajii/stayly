'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/lib/actions';
import Link from 'next/link';

function RegisterButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md disabled:opacity-70 mt-4"
    >
      {pending ? 'Creating account...' : 'Create account'}
    </button>
  );
}

export default function SignupPage() {
  const [errorMessage, formAction] = useFormState(register, undefined);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 tracking-tight">
          Join Stayly
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#FF5A5F] hover:text-[#E0484D]">
            Log in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl border border-stone-100 sm:rounded-3xl sm:px-10">
          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-stone-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-900"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  minLength={6}
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
              <RegisterButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
