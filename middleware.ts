import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "access_secret"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const userRole = req.cookies.get("role")?.value;

  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // 1. If user is logged in and tries to access auth pages, redirect to dashboard
  if (accessToken && isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. If user is NOT logged in and tries to access protected routes, redirect to login
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. Verify JWT for protected routes (additional security)
  if (accessToken && isProtectedRoute) {
    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
      
      // Role-based protection: Only admin can access /dashboard/users
      if (pathname.startsWith("/dashboard/users") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      // Token invalid or expired
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      response.cookies.delete("role");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
