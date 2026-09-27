'use client';

import { Home, MapPin, DollarSign, Users, FileText, Tag, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { createProperty } from '@/lib/property-actions';

const AMENITY_OPTIONS = [
  'WiFi', 'Pool', 'Air Conditioning', 'Parking', 'Kitchen',
  'Washer/Dryer', 'TV', 'Gym', 'Fireplace', 'Garden',
  'Beach access', 'Mountain view', 'Hot tub', 'BBQ grill',
  'Pet friendly', 'Breakfast included', 'Airport transfer',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-[#FF5A5F] text-white font-bold py-4 rounded-xl hover:bg-[#E0484D] transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
    >
      {pending ? 'Creating listing...' : 'Create Listing'}
    </button>
  );
}

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/host" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition mb-4 inline-block">
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 tracking-tight">List a new property</h1>
              <p className="text-stone-500 mt-0.5">Share your space and start earning</p>
            </div>
          </div>
        </div>

        <form action={createProperty} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-[#FF5A5F]" />
              <h2 className="text-lg font-bold text-stone-800">Basic Information</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Cozy Beachfront Villa in Goa"
                  className="w-full border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-800 bg-stone-50 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe your property: what makes it special, nearby attractions, house rules..."
                  className="w-full border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-800 bg-stone-50 focus:bg-white transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Pricing */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#FF5A5F]" />
              <h2 className="text-lg font-bold text-stone-800">Location &amp; Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">City / Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Goa, Mumbai, Jaipur"
                  className="w-full border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-800 bg-stone-50 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Price per Night ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="number"
                    name="pricePerNight"
                    required
                    min="1"
                    step="1"
                    placeholder="0"
                    className="w-full pl-10 border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent font-medium text-stone-800 bg-stone-50 focus:bg-white transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Property Type *</label>
                <select
                  name="type"
                  required
                  className="w-full border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] font-medium bg-stone-50 focus:bg-white cursor-pointer transition text-stone-800"
                >
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
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Max Guests *</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="number"
                    name="maxGuests"
                    required
                    min="1"
                    max="20"
                    defaultValue="2"
                    className="w-full pl-10 border border-stone-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] font-medium bg-stone-50 focus:bg-white transition text-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-[#FF5A5F]" />
              <h2 className="text-lg font-bold text-stone-800">Amenities</h2>
            </div>
            <p className="text-sm text-stone-500 mb-5">Select all amenities available at your property. These names will be stored individually (comma-joined).</p>
            {/* Hidden field to collect amenities as comma-separated */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" id="amenities-grid">
              {AMENITY_OPTIONS.map(amenity => (
                <label key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="amenity_checkbox"
                    value={amenity}
                    className="w-4 h-4 accent-[#FF5A5F] cursor-pointer flex-shrink-0"
                    onChange={(e) => {
                      // Will be processed client-side on submit
                    }}
                  />
                  <span className="text-sm font-medium text-stone-700">{amenity}</span>
                </label>
              ))}
            </div>
            {/* We also provide a hidden text field for the amenities value collected on submit via JS */}
            <input type="hidden" name="amenities" id="amenities-hidden" />
          </div>

          {/* Section 4: Images */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-[#FF5A5F]" />
              <h2 className="text-lg font-bold text-stone-800">Property Images</h2>
            </div>
            <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50 hover:border-[#FF5A5F] transition">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ImageIcon className="w-7 h-7 text-stone-400" />
              </div>
              <p className="font-semibold text-stone-700 mb-1">Upload property photos</p>
              <p className="text-sm text-stone-500 mb-4">Select multiple high-quality images to showcase your space. First image will be the cover photo.</p>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 cursor-pointer"
              />
            </div>
            <p className="text-xs text-stone-400 mt-3">Tip: Upload at least 3 photos for better visibility.</p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Link href="/host" className="flex-1 bg-stone-100 text-stone-700 font-bold py-4 rounded-xl hover:bg-stone-200 transition text-center">
              Cancel
            </Link>
            <SubmitButton />
          </div>
        </form>

        <script dangerouslySetInnerHTML={{__html: `
          document.querySelector('form').addEventListener('submit', function(e) {
            var checked = Array.from(document.querySelectorAll('input[name="amenity_checkbox"]:checked')).map(function(cb) { return cb.value; });
            document.getElementById('amenities-hidden').value = checked.join(',');
          });
        `}} />
      </div>
    </div>
  );
}
