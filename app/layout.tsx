import "./globals.css";
import { Inter, Oswald } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "300", "600", "500"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "300", "600", "500"],
  variable: "--font-oswald",
});

export const metadata = {
  title: "Changes Fitness Club",
  description: "Website for a gym called Changes Fitness Club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
