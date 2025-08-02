import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { AuthNotificationsModal } from "@/components/shared/widgets/auth-notifications-modal";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Taqwa",
  description: "app for every muslims",
  manifest: "/manifest.json",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider />
          <main>
            {children}
            <AuthNotificationsModal />
            <BottomNavigation />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
