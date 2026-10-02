import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Lobo Travels — Professional Itinerary Builder & Tour Operations',
  description: 'Enterprise travel operations portal for Lobo Travels: build high-converting client itineraries, manage hotels and fleet, and generate instant travel vouchers.',
  openGraph: {
    title: 'Lobo Travels — Professional Itinerary Builder',
    description: 'Enterprise travel operations portal for Lobo Travels.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lobo Travels — Professional Itinerary Builder',
    description: 'Enterprise travel operations portal for Lobo Travels.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
