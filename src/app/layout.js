import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import LocationTracingWrapper from "../components/LocationTracingWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VISTA - Night Attendance",
  description: "VISTA college night attendance system",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <LocationTracingWrapper>
              <Navbar />
              <div className="container-app py-6 flex gap-6 min-h-screen">
                <div className="hidden lg:block">
                  <Sidebar />
                </div>
                <main className="flex-1 min-w-0 overflow-x-auto px-4 lg:px-0">{children}</main>
              </div>
            </LocationTracingWrapper>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
