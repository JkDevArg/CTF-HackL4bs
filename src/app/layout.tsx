import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackL4bs CTF — Capture The Flag | Cybersecurity Challenge",
  description: "Únete al CTF más brutal de la escena hacker latinoamericana. Web pentesting, OSINT, Reverse Engineering, Crypto y más. ¿Tienes el nivel?",
  keywords: ["CTF", "Capture The Flag", "hacking", "ciberseguridad", "web pentesting", "HackL4bs", "cybersecurity"],
  openGraph: {
    title: "HackL4bs CTF 2026",
    description: "La competencia de hacking más intensa. Entra si te atreves.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
