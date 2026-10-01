import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReadingProgress, Toc } from "@/components/client";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your First Keploy Tests in Go · Gin + MongoDB",
  description:
    "A beginner-friendly tutorial: record real API traffic from a Gin + MongoDB app with Keploy and replay it as tests, with no test code written.",
};

const REPO_URL = "https://github.com/mukund2910/keploy-gin-mongo-guide";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-white font-sans text-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <ThemeProvider>
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
              <a href="#" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-orange-500 to-amber-400 text-sm text-white">
                  K
                </span>
                <span className="hidden sm:inline">Keploy Go Guide</span>
              </a>
              <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-800">
                Gin + MongoDB
              </span>
              <nav className="ml-auto flex items-center gap-1 text-sm">
                <a
                  href="https://keploy.io/docs/"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Keploy Docs
                </a>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  GitHub
                </a>
                <ThemeToggle />
              </nav>
            </div>
            <ReadingProgress />
          </header>

          <div className="mx-auto flex max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:py-14">
            <article className="prose prose-zinc min-w-0 max-w-3xl flex-1 dark:prose-invert prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-h2:mt-14 prose-h2:border-t prose-h2:border-zinc-200 prose-h2:pt-10 dark:prose-h2:border-zinc-800 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-orange-400">
              {children}
            </article>
            <aside className="hidden w-56 shrink-0 lg:block">
              <div className="sticky top-24">
                <Toc />
              </div>
            </aside>
          </div>

          <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
            Written with Next.js + MDX · Sample app from{" "}
            <a className="underline" href="https://github.com/keploy/samples-go/tree/main/gin-mongo" target="_blank" rel="noreferrer">
              keploy/samples-go
            </a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
