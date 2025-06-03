'use client';

export default function Redirect({ orderId }: { orderId: string }) {
  const BAKO_MARKETPLACE_URL = process.env.NEXT_PUBLIC_APP_URL;
  if (!BAKO_MARKETPLACE_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
  }
  if (typeof window !== 'undefined') {
    window.location.href = `${BAKO_MARKETPLACE_URL}/marketplace/order/${orderId}`;
  }
  return null;
}
