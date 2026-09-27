'use client';

import { cancelBooking } from '@/lib/booking-actions';
import { useState } from 'react';

interface CancelButtonProps {
  bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleCancel() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setLoading(true);
    try {
      await cancelBooking(bookingId);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setConfirmed(false);
    }
  }

  if (confirmed) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-500">Are you sure?</span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-sm font-semibold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-70"
        >
          {loading ? 'Cancelling...' : 'Yes, cancel'}
        </button>
        <button
          onClick={() => setConfirmed(false)}
          className="text-sm font-semibold text-stone-600 px-3 py-2 rounded-lg hover:bg-stone-100 transition"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleCancel}
      className="text-sm font-semibold text-red-600 border border-red-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition"
    >
      Cancel booking
    </button>
  );
}
