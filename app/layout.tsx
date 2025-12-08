import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ToastProvider>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {/* {children} page */}
                {children}
              </main>
              <footer className="w-full border-t border-default-100 mt-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-4 text-xs text-default-500">
                  <span>
                    © {new Date().getFullYear()} NASA Explorer — CSU Web Engineering (CPSC 6175)
                  </span>

                  <a
                    href="https://github.com/CSU-WebEngineering-fall25/group-project-group1-nasa-api"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    View project on GitHub
                  </a>
                </div>
              </footer>
            </div>
        </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}