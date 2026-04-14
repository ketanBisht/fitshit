import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  // Define what the base domain is
  const baseHostname = process.env.NEXT_PUBLIC_BASE_DOMAIN || (isLocalhost ? 'localhost:3000' : 'fitshit.com');
  
  if (!hostname.includes(baseHostname)) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${baseHostname}`, '');

  // Platform-wide routes that SHOULD NOT be rewritten (always serve from root)
  const platformRoutes = ['admin', 'api', '_next', '_static'];
  const firstPathSegment = url.pathname.split('/')[1];

  if (subdomain === hostname || subdomain === 'www' || subdomain === baseHostname || platformRoutes.includes(firstPathSegment)) {
    return NextResponse.next();
  }

  // Tenant subdomain: Rewrite path to gym folder
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname === '/' ? '' : url.pathname}`, req.url));
}
