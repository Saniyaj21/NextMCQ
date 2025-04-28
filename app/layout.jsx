import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/ui/Header';
import { Toaster } from 'react-hot-toast';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'NextMCQ',
  description: 'Interactive MCQ Learning Platform',
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}
        >
          <Toaster 
            position="bottom-right"
            toastOptions={{
              success: {
                style: {
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #6ee7b7',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                },
                iconTheme: {
                  primary: '#059669',
                  secondary: '#ecfdf5',
                }
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fca5a5',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fef2f2',
                }
              },
              duration: 4000,
            }}
          />
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
