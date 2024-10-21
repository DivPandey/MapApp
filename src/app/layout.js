import './globals.css'

export const metadata = {
  title: 'Pin Drop App',
  description: 'Drop pins on a map and add remarks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}