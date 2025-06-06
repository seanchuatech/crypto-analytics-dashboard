import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Received credentials:", credentials);

        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });

        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        if (!user.password) {
          console.log("❌ User has no password");
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log("✅ Password match:", isValid);

        if (!isValid) {
          console.log("❌ Invalid password");
          return null;
        }

        console.log("✅ Login success");
        return {
          id: user.id,
          name: user.name ?? user.username,
          email: user.email ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/", // Redirects to home for sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
