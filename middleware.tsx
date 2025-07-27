import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const requireAuth: string[] = ["/"];
const disableAuth: string[] = [
  "/api/auth",
  "/api/mobile",
  "/login",
  "/template",
  "/tema",
  "/_next",
  "/favicon.ico",
];


const loginPath: string = "/login";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  

  if (token && pathname.match(loginPath)) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  if (disableAuth.some((x) => pathname.startsWith(x))) {
    return res;
  }

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const url = new URL("/login", request.url);
      // url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  

  return res;
}