import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const { handlers, signIn, signOut, auth } =  NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const { email, password } = credentials;
  
          // Busca el usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email },
          });
  
          if (!user) {
            throw new Error("Credenciales incorrectas");
          }
  
          // Verifica la contraseña
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error("Credenciales incorrectas");
          }
  
          // Retorna el usuario si es válido
          return {
            id: user.id,
            email: user.email,
            role: user.role, // Importante para proteger rutas de administrador
          };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ session, user, token }) {
        if (token) {
          session.user = {
            id: token.id,
            email: token.email,
            role: token.role, // Añade el rol al token
          };
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.role = user.role; // Pasa el rol al token
        }
        return token;
      },
    }
  });
  
  export const { GET, POST } = handlers