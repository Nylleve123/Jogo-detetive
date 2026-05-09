import type { Metadata, Viewport } from 'next'
import { Special_Elite, Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const specialElite = Special_Elite({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-special-elite'
});

const courierPrime = Courier_Prime({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-courier-prime'
});

export const metadata: Metadata = {
  title: 'Dossiê Criminal - Jogo de Detetive',
  description: 'Um jogo de investigação e dedução para desvendar crimes misteriosos',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1f',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark bg-background">
      <body className={`${specialElite.variable} ${courierPrime.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
