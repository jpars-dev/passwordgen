/**
 * @file layout.js
 * @description Root layout component for the Next.js application.
 *
 * This file defines the top-level HTML structure that wraps all pages.
 * It handles:
 * - Global CSS imports
 * - Vercel Analytics for performance monitoring
 * - SEO metadata configuration
 * - PWA manifest and icons
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */

import './globals.css'
import { Analytics } from "@vercel/analytics/next"

/**
 * Next.js Metadata Configuration
 *
 * Defines SEO-related metadata for the application including:
 * - Page title and description for search engines
 * - Keywords for SEO optimization
 * - Open Graph tags for social media sharing
 * - Robot directives for search engine crawling
 * - PWA manifest and app icons
 * - Theme color for browser UI
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'The Password Generator by jpars-dev',
  description: 'A refined password generator with no memory. Your passwords are generated locally in your browser and never stored or sent anywhere. Something useful, thoughtfully made.',
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
  // Open Graph metadata for social media sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    title: 'The Password Generator by jpars-dev',
    description: 'A refined password generator with no memory. Your passwords are generated locally in your browser and never stored or sent anywhere. Something useful, thoughtfully made.',
    type: 'website',
  },
  // Search engine crawler directives
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
  // PWA manifest file location
  manifest: '/manifest.json',
  // Favicon and app icons for various platforms and sizes
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    // Apple-specific touch icon
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  // Browser/PWA theme color (matches the app's dark theme)
  themeColor: '#000000',
}

/**
 * Root Layout Component
 *
 * The root layout wraps all pages in the application. It provides:
 * 1. The basic HTML document structure
 * 2. Vercel Analytics for automatic performance tracking
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page components to render
 * @returns {JSX.Element} The root HTML structure
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        {/*
          Vercel Analytics Component

          Automatically tracks Core Web Vitals and page views.
          Works out of the box when deployed to Vercel.
          Data is available in the Vercel dashboard under Analytics.

          @see https://vercel.com/docs/analytics
        */}
        <Analytics />
      </body>
    </html>
  )
}
