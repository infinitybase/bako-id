import { NextResponse, type NextRequest } from 'next/server';

const isProduction = process.env.NODE_ENV !== 'development';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === '/' && isProduction) {
    return NextResponse.redirect('https://www.bako.id/');
  }

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}

export const config = {
  matcher: '/:path*',
};
