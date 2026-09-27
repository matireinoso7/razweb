import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/components/auth/auth-context";

export const metadata: Metadata = {
  title: "RazWeb - Portal de Noticias sobre Inteligencia Artificial & Tecnología",
  description: "Noticias en tiempo real sobre IA, papers de investigación de arXiv y actualizaciones oficiales de las principales empresas de tecnología.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
