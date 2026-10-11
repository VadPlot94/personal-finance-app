import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import authService from "@/back-end/DAL/db-services/auth.service";
import prisma from "@/back-end/prisma/prisma-client";

export const authOptions: NextAuthConfig = {
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
      // run when the user try to login, check credentials and return user data if credentials are valid, otherwise return null
      // returned data will be set to JWT token and session (see callbacks below)
      async authorize(
        credentials:
          | Partial<Record<"email" | "password", string | unknown>>
          | undefined,
      ) {
        // authorize method only for login (not register)
        const result = await authService.autorizeUser(credentials);
        if (!result.data?.id) {
          return null;
        }
        return {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          isAdmin: Boolean(result.data.isAdmin),
        } satisfies User;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent select_account",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    // page where not authenticated user will be redirect if it try to access some other "protected" pages
    signIn: "/login",
  },
  callbacks: {
    // By default NextAuth will set only user id, email, name to JWT token and session, but we want to have more user data there
    // so we set whole user object to token and session after successful login in authorize method of provider
    async jwt({ token, user }) {
      // After successful login set user data to JWT token with first login
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: Boolean(user.isAdmin),
        };
      }
      return token;
    },
    // By default NextAuth will set to session only base fields (user id, email, name) from token, but we want to have more user data in session
    // so we set whole user object to session from token
    async session({ session, token }) {
      // After successful login set user to session and send to client
      // After that we can use session user data on the client side and in server actions
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          email: token.user.email ?? session.user.email,
          name: token.user.name ?? session.user.name,
          isAdmin: Boolean(token.user.isAdmin),
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth } = NextAuth(authOptions);
export const getAuthOptions = () => authOptions;
export default authOptions;
