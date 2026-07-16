import { NextRequest, NextResponse } from "next/server";

// Middleware để bảo vệ routes - Simplified check without Prisma
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authjs.session")?.value;

  // Kiểm tra routes admin
  if (pathname.startsWith("/admin")) {
    // Nếu chưa có token, redirect đến login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Kiểm tra route login - nếu đã đăng nhập thì redirect về admin
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các routes cần thiết
export const config = {
  matcher: ["/admin/:path*", "/login"],
};