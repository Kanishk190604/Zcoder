import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/Authentication/SignIn', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/problemlist/:path*'],
};