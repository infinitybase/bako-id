export const metadata = {
  title: 'Bako Identity',
  description: 'Embrace your digital legacy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
