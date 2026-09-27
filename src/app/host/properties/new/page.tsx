'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createProperty } from '@/lib/property-actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition disabled:bg-orange-400"
    >
      {pending ? 'Creating Property...' : 'List Property'}
    </button>
  );
}

export default function NewPropertyPage() {
  const [state, formAction] = useFormState(createProperty, null);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-stone-100">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">List a new property</h1>
        
        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
            <input 
              type="text" 
              name="title" 
              required 
              placeholder="e.g. Cozy Cabin in the Woods"
              className="w-full border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              placeholder="Tell guests about your place..."
              className="w-full border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
              <input 
                type="text" 
                name="location" 
                required 
                placeholder="e.g. Aspen, Colorado"
                className="w-full border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price per Night ($)</label>
              <input 
                type="number" 
                name="pricePerNight" 
                required 
                min="1"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Property Images</label>
            <input 
              type="file" 
              name="images" 
              multiple 
              accept="image/*"
              className="w-full border border-stone-300 rounded-lg p-3 text-stone-600 bg-stone-50"
            />
            <p className="text-xs text-stone-500 mt-2">You can select multiple images.</p>
          </div>

          {state?.error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
