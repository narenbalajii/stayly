'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to book a property.');
  }

  const propertyId = formData.get('propertyId') as string;
  const checkInRaw = formData.get('checkIn') as string;
  const checkOutRaw = formData.get('checkOut') as string;

  if (!propertyId || !checkInRaw || !checkOutRaw) {
    throw new Error('Please select check-in and check-out dates.');
  }

  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);

  if (checkIn >= checkOut) {
    throw new Error('Check-out date must be after check-in date.');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    throw new Error('Cannot book in the past.');
  }

  // 1. Fetch property to get actual price
  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property || property.status !== 'ACTIVE') {
    throw new Error('Property is not available.');
  }

  // 2. Calculate overlaps
  const overlappingBookings = await db.booking.findMany({
    where: {
      propertyId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      AND: [
        { checkIn: { lt: checkOut } },
        { checkOut: { gt: checkIn } }
      ]
    }
  });

  if (overlappingBookings.length > 0) {
    throw new Error('These dates are already booked. Please select different dates.');
  }

  // 3. Calculate total price securely on backend
  const msPerDay = 1000 * 60 * 60 * 24;
  const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);
  const totalPrice = Number(property.pricePerNight) * numberOfNights;

  // 4. Create booking
  await db.booking.create({
    data: {
      guestId: session.user.id,
      propertyId,
      checkIn,
      checkOut,
      totalPrice,
      status: 'CONFIRMED' // Auto-confirming for simplicity
    }
  });

  redirect('/my-bookings');
}

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.guestId !== session.user.id) throw new Error('Unauthorized');
  if (booking.status === 'CANCELLED') throw new Error('Already cancelled');

  await db.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' }
  });

  revalidatePath('/my-bookings');
}
