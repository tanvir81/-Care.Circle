import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Care.Circle | Reliable Caregiving Services",
  description: "Book trusted caretakers for children, elderly, and sick family members.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <Navbar />
          <main className="min-h-[80vh]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
