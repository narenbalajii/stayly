'use client';

import { createProperty } from '@/lib/property-actions';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">List a new property</h1>
        </div>
        
        <form action={createProperty} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Title</label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="e.g. Cozy Cabin in the Woods"
                className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                name="description" 
                required 
                rows={4}
                placeholder="Tell guests about your place..."
                className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  required 
                  placeholder="e.g. Aspen, Colorado"
                  className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Price per Night ($)</label>
                <input 
                  type="number" 
                  name="pricePerNight" 
                  required 
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Property Type</label>
                <select name="type" required className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] font-medium bg-white cursor-pointer">
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Luxury stay">Luxury stay</option>
                  <option value="Beach stay">Beach stay</option>
                  <option value="Mountain stay">Mountain stay</option>
                  <option value="Cabin">Cabin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Max Guests</label>
                <input 
                  type="number" 
                  name="maxGuests" 
                  required 
                  min="1"
                  max="20"
                  defaultValue="2"
                  className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Amenities (Comma separated)</label>
              <input 
                type="text" 
                name="amenities" 
                placeholder="e.g. WiFi, Pool, Air Conditioning"
                className="w-full border border-stone-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Property Images</label>
              <input 
                type="file" 
                name="images" 
                multiple 
                accept="image/*"
                className="w-full border border-stone-300 rounded-xl p-3 text-stone-600 bg-stone-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300"
              />
              <p className="text-xs text-stone-500 mt-2 font-medium">Select multiple high-quality images to showcase your space.</p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/host" className="flex-1 bg-stone-100 text-stone-700 font-bold py-4 rounded-xl hover:bg-stone-200 transition text-center">
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md"
            >
              List Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
