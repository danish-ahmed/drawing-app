// app/api/auth/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connect from '@/utils/db';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
  ],
  callbacks: {
    session({session,user}: { session: any; user: any }){
      session.user.id = user._id;
      return session;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider == 'credentials') {
        return true;
      }
      await connect();
      try {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            email: user.email,
          });
          await newUser.save();
        }
        return true;
      } catch (err) {
        console.log('Error saving user', err);
        return false;
      }
    },
  },
};

export default authOptions;
