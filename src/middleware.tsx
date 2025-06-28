// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './app/lib/firebase-admin';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const verifiedToken = token ? await verifyIdToken(token) : null;

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !verifiedToken) {
    return NextResponse.redirect(new URL('/Authentication/SignIn', req.url));
  }

  return NextResponse.next();
}

// Define paths to run middleware on
export const config = {
  matcher: ['/user/problemlist/:path*'],
};

