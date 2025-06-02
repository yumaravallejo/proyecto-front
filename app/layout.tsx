import "./globals.css";
import Head from "next/head";
import { Inter, Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export const metadata = {
  title: "Mi Web",
  description: "Prueba de fuentes",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
