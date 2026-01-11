import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  // If not logged in and trying to access dashboard → redirect to login
  if (isDashboard && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If logged in and going to /login → redirect to dashboard
  if (isLogin && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};