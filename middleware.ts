// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0];

  // Add the subdomain to the URL's search parameters
  url.searchParams.set('subdomain', subdomain);

  // Rewrite to the login page with subdomain query
  if (url.pathname.startsWith('/login')) {
    return NextResponse.rewrite(`/login?subdomain=${subdomain}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/login', // Apply the middleware to the login route
};
