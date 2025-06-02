import { NextResponse, type NextRequest } from 'next/server';

const isProduction = process.env.NODE_ENV !== 'development';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === '/' && isProduction) {
    return NextResponse.redirect('https://www.bako.id/');
  }

  if (pathname.includes('/marketplace/order/')) {
    const BAKO_MARKETPLACE_URL =
      process.env.NEXT_PUBLIC_BAKO_MARKETPLACE_URL || 'https://localhost:5173';
    const orderId = pathname.split('/').pop();
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
