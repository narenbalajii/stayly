'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/lib/actions';
import Link from 'next/link';

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-4 w-full bg-orange-600 text-white p-3 rounded-md font-semibold hover:bg-orange-700 transition"
      aria-disabled={pending}
    >
      {pending ? 'Signing up...' : 'Sign up'}
    </button>
  );
}

export default function SignupPage() {
  const [errorMessage, dispatch] = useFormState(register, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold text-stone-800 mb-6 text-center">Create a Stayly Account</h1>
        <form action={dispatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1" htmlFor="name">Full Name</label>
            <input
              className="w-full border border-stone-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1" htmlFor="email">Email</label>
            <input
              className="w-full border border-stone-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1" htmlFor="password">Password</label>
            <input
              className="w-full border border-stone-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <RegisterButton />
          {errorMessage && (
            <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>
          )}
          <div className="text-center mt-4 text-sm text-stone-600">
            Already have an account? <Link href="/login" className="text-orange-600 hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
