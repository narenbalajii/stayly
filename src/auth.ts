import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        });
        
        if (!user) return null;
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        
        if (passwordsMatch) return { id: user.id, email: user.email, name: user.name, role: user.role };
        
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore - custom role property
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token?.role && session.user) {
        // @ts-ignore - custom role property
        session.user.role = token.role;
      }
      return session;
    }
  }
});
