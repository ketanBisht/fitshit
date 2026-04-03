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
  const baseHostname = isLocalhost ? 'localhost:3000' : 'fitshit.com';
  
  if (!hostname.includes(baseHostname)) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${baseHostname}`, '');

  // Main domain or www - leave as is
  if (subdomain === hostname || subdomain === 'www' || subdomain === baseHostname) {
    return NextResponse.next();
  }

  // Otherwise, it's a tenant subdomain. Rewrite path to include subdomain folder
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname === '/' ? '' : url.pathname}`, req.url));
}
