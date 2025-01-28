import { Geist, Geist_Mono } from "next/font/google";

// Configuración de las fuentes de Google
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Puedes agregar meta tags aquí si lo deseas */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Aseguramos que las fuentes estén aplicadas globalmente
      >
        {children}  {/* Esto renderiza los componentes hijos */}
      </body>
    </html>
  );
}
