import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/back-end/prisma/prisma-client";
import { userRepository } from "@/back-end/DAL/repositories/user.repository";

const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "password";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const validEmail = process.env.AUTH_EMAIL || DEFAULT_EMAIL;
        const validPassword = process.env.AUTH_PASSWORD || DEFAULT_PASSWORD;

        let user = (await userRepository.findByEmail(email, {
          id: true,
          email: true,
          name: true,
          hashedPassword: true,
        })) as {
          id: string;
          email: string | null;
          name: string | null;
          hashedPassword: string | null;
        } | null;

        if (!user) {
          if (email !== validEmail || password !== validPassword) {
            return null;
          }

          user = await userRepository.createUser(
            {
              email,
              name: email.split("@")[0],
              hashedPassword: hashPassword(password),
            },
            {
              id: true,
              email: true,
              name: true,
              hashedPassword: true,
            },
          );
        }

        if (!user?.hashedPassword) {
          return null;
        }

        const isValid = verifyPassword(password, user.hashedPassword);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as typeof token.user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "MyCustomRandomSecret319_ttsdt31231657948" || "change-me-to-a-secret",
};

export const getAuthOptions = () => authOptions;
export default authOptions;
