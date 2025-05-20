import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Bako Identity',
  description: 'Embrace your digital legacy',
};

const interFont = Inter({
  weight: ['100', '200', '500', '900'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={interFont.className}>
      <body>{children}</body>
    </html>
  );
}
