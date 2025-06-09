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
        <link
          rel="preconnect"
          href="https://sb-changes.onrender.com"
        />
        <link
          rel="preload"
          as="image"
          href="/img/zumba.webp"
          type="image/webp"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = '/css/f63175d15d0525ee.css';
            l.media = 'print';
            l.onload = () => { l.media = 'all'; };
            document.head.appendChild(l);
          `,
          }}
        />

        <noscript>
          <link rel="stylesheet" href="/css/f63175d15d0525ee.css" />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
