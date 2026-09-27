'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut();
}

export async function register(prevState: string | undefined, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password || !name) {
    return 'Missing required fields.';
  }
  
  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    
    if (existingUser) {
      return 'User already exists with this email.';
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await db.user.create({
      data: { name, email, passwordHash, role: 'GUEST' }
    });
  } catch (error) {
    return 'Failed to register user. Please try again.';
  }
  
  redirect('/login');
}
