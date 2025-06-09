import "./globals.css";
import { Inter, Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Changes Fitness Club",
  description:
    "Página oficial de Changes Fitness Club, donde podrás encontrar horarios de actividades, dietas y más.",
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
    <html lang="es" className={`${inter.className} ${oswald.className}`}>
      <head>
        <link rel="dns-prefetch" href="https://sb-changes.onrender.com" />
        <link rel="preconnect" href="https://sb-changes.onrender.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/img/zumba.webp" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
