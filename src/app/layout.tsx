import type { Metadata } from "next";
import { Ubuntu, Fira_Sans, Amita, Lora } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/layout/app-header";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const amita = Amita({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  variable: "--font-amita",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sadhana Tracker",
  description: "A personal journal for tracking daily spiritual practices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${firaSans.variable} ${amita.variable} ${lora.variable} h-full antialiased`}
      // * it tells nextjs to loaed Ubuntu and FiraSans and expose theri CSS variables
    >
      <body className="flex flex-col min-h-full">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
