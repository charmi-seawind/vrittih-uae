import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { METADATA_CONFIG } from "@/config/metadata";
import ThemeProvider from "@/context/ThemeProvider";
import Toaster from "@/components/ui/toaster";

import ReactQueryProvider from "@/context/ReactQueryProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = METADATA_CONFIG;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="icon"
        type="image/png"
        href="/favicon/favicon-logo.png"
        sizes="48x48"
      />

      <link rel="icon" type="image/png" href="/logo/vrrittih.png" />
      <link rel="shortcut icon" href="/favicon/favicon-logo.png" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        precedence="default"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/favicon.ico"
      />
      <meta
        name="google-site-verification"
        content="XMUC6CCDKCNsy6UZamxuVqmwZqoFwG0Go3AKrEY_MuQ"
      />
      <meta name="apple-mobile-web-app-title" content="Vrrittih" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
