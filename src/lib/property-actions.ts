'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { uploadImageBuffer } from './cloudinary';

export async function createProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const type = formData.get('type') as string || 'Apartment';
  const priceRaw = formData.get('pricePerNight') as string;
  const guestsRaw = formData.get('maxGuests') as string;

  const pricePerNight = parseFloat(priceRaw);
  const maxGuests = parseInt(guestsRaw) || 2;

  const amenitiesRaw = formData.get('amenities') as string;
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').map(a => a.trim()).filter(a => a) : [];

  if (!title || !description || !location || isNaN(pricePerNight)) {
    throw new Error('Missing or invalid required fields.');
  }

  // Handle image uploads
  const imageFiles = formData.getAll('images') as File[];
  const imageUrls: string[] = [];

  try {
    for (const file of imageFiles) {
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await uploadImageBuffer(buffer);
        imageUrls.push(url);
      }
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload images. Please check your Cloudinary configuration.');
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (user?.role === 'GUEST') {
      await db.user.update({
        where: { id: session.user.id },
        data: { role: 'HOST' }
      });
    }

    await db.property.create({
      data: {
        hostId: session.user.id,
        title,
        description,
        location,
        pricePerNight,
        type,
        maxGuests,
        amenities,
        status: 'ACTIVE',
        images: {
          create: imageUrls.map(url => ({ imageUrl: url }))
        }
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save property to the database.');
  }

  redirect('/host');
}

export async function updatePropertyStatus(propertyId: string, status: 'ACTIVE' | 'INACTIVE') {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property || property.hostId !== session.user.id) throw new Error('Unauthorized');

  await db.property.update({
    where: { id: propertyId },
    data: { status }
  });

  revalidatePath('/host');
}

export async function deleteProperty(propertyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property || property.hostId !== session.user.id) throw new Error('Unauthorized');

  // Check for active bookings
  const activeBookings = await db.booking.count({
    where: {
      propertyId,
      status: { in: ['PENDING', 'CONFIRMED'] }
    }
  });

  if (activeBookings > 0) {
    throw new Error('Cannot delete a property with active bookings.');
  }

  await db.property.delete({ where: { id: propertyId } });

  revalidatePath('/host');
}
