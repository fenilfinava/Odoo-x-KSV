import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "VendorBridge - Procurement ERP",
  description: "Comprehensive Procurement & Vendor Management ERP system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased bg-slate-50 text-slate-900`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
