import './globals.css'

export const metadata = {
  title: 'Password Generator',
  description: 'Generate secure passwords with configurable options',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="cyberpunk">
      <body>{children}</body>
    </html>
  )
}
