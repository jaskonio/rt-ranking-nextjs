import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    // Redirige a login si no está autenticado
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Permite solo administradores
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
