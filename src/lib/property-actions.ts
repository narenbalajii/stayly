'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { uploadImageBuffer } from './cloudinary';

export async function createProperty(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const priceRaw = formData.get('pricePerNight') as string;
  const pricePerNight = parseFloat(priceRaw);
  
  if (!title || !description || !location || isNaN(pricePerNight)) {
    return { error: 'Missing or invalid required fields.' };
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
    return { error: 'Failed to upload images. Please check your Cloudinary configuration.' };
  }

  try {
    // Ensure user has HOST role
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
        status: 'ACTIVE',
        images: {
          create: imageUrls.map(url => ({ imageUrl: url }))
        }
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'Failed to save property to the database.' };
  }

  redirect('/host');
}
