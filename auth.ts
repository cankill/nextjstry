import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'sysadm',
    host: 'localhost',
    database: 'nextjs',
    password: 'change_me',
    port: 6432
  })

async function getUser(email: string): Promise<User | undefined> {
  try {
    const sql = `SELECT * FROM users WHERE email=$1`;
    const values = [email];
    const user = await pool.query<User>(sql, values);
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
} 
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password);
 
                if (passwordsMatch) return user;
            }
 
            console.log('Invalid credentials');
            return null;
        },}),
  ],
});