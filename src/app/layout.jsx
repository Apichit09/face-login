import "./globals.css";
import { Kanit } from "next/font/google";
import Footer from "@/components/layout/Footer";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata = {
  title: "Face Login",
  description: "Web-Based Facial Authentication System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning> 
      <body className={kanit.variable}>
        <main className="app-shell">{children}</main>
        <Footer />
      </body>
    </html>
  );
}