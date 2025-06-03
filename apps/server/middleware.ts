import { NextResponse, type NextRequest } from 'next/server';

const isProduction = process.env.NODE_ENV !== 'development';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === '/' && isProduction) {
    return NextResponse.redirect('https://www.bako.id/');
  }

  if (pathname.includes('/m/')) {
    const BAKO_MARKETPLACE_URL = process.env.NEXT_PUBLIC_APP_URL;
    if (!BAKO_MARKETPLACE_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL is not defined');
    }
    const orderId = pathname.split('/m/')[1];
    return NextResponse.redirect(
      `${BAKO_MARKETPLACE_URL}/marketplace/order/${orderId}`
    );
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
