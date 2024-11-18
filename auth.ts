import NextAuth from "next-auth"
import GithubProvider from 'next-auth/providers/github'
import { author_by_github_query } from "./sanity/lib/querys"
 import { client } from "./sanity/lib/client"
import { writeClient } from "./sanity/lib/write-client"
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(author_by_github_query, { id: profile?.id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            _id: `github-${profile?.id}`, // Use prefixed ID for uniqueness
            name: user?.name,
            username: profile?.login,
            image: user?.image,
            email: user?.email,
            bio: profile?.bio || "Bio not provided",
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (account) {
        const user = await client.withConfig({
          useCdn:false
        }).fetch(author_by_github_query, { id: profile?.id });
        if (user) {
          token.id = user?._id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
