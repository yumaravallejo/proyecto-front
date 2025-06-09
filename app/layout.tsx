import { preconnect } from "react-dom";
import "./globals.css";
import { Inter, Oswald } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export const metadata = {
  title: "Changes Fitness Club",
  description: "Página oficial de Changes Fitness Club, donde podrás encontrar horarios de actividades, dietas y más.",
  icons: {
    icon: "/logo.svg",
  },
  preconnect: "https://sb-changes.onrender.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.className} ${oswald.className}`}>
      <body>{children}</body>
    </html>
  );
}
