import './globals.css'
import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '../lib/gtag'

export const metadata = {
  title: 'The Password Creator | Secure Password Generator',
  description: 'Generate strong, secure passwords instantly with customizable options for length, symbols, numbers, and case sensitivity. A modern, user-friendly password generator.',
  keywords: [
    'password generator',
    'secure password',
    'strong password',
    'random password',
    'password creator',
    'password tool',
    'cybersecurity',
    'online security',
    'password security'
  ],
  openGraph: {
    title: 'The Password Creator | Secure Password Generator',
    description: 'Generate strong, secure passwords instantly with customizable options for length, symbols, numbers, and case sensitivity.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  themeColor: '#ffd000',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="cyberpunk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
