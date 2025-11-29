import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "@/app/globals.css";
import Providers from "./providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Latency Topology Visualizer",
  description: "Visualize the latency of your network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} font-sora antialiased dark`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
