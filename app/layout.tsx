import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { ReadingProgress, Reveal } from "@/components/client";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import "./globals.css";

const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });
const serif = Source_Serif_4({ variable: "--font-serif4", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Your first Keploy tests in Go (Gin + MongoDB)",
  description:
    "A beginner-friendly tutorial: record real API traffic from a Gin + MongoDB app with Keploy and replay it as tests, with no test code written.",
};

const REPO_URL = "https://github.com/Mukund2910/keploy-gin-mongo-guide";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${serif.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-panel focus:px-3 focus:py-2"
          >
            Skip to content
          </a>

          <header className="sticky top-0 z-30 border-b border-rule bg-paper/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-10">
              <a href="#" className="group flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 text-sm text-white shadow-md shadow-orange-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  K
                </span>
                <span className="hidden sm:inline">Keploy Go Guide</span>
              </a>
              <span className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-muted">Gin + MongoDB</span>
              <nav className="ml-auto flex items-center gap-1 text-sm text-muted">
                <a href="https://keploy.io/docs/" target="_blank" rel="noreferrer" className="hidden rounded-lg px-3 py-2 transition-colors hover:bg-sunk hover:text-ink sm:inline">
                  Keploy docs
                </a>
                <a href={REPO_URL} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 transition-colors hover:bg-sunk hover:text-ink">
                  GitHub
                </a>
                <ThemeToggle />
              </nav>
            </div>
            <ReadingProgress />
          </header>

          <div aria-hidden className="backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="dots absolute inset-0" />
            <div className="glow glow-left" />
            <div className="glow glow-right" />
          </div>

          <main id="content" className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 lg:px-10 lg:pt-20">
            <article className="doc">{children}</article>
            <Reveal />
          </main>

          <footer className="border-t border-rule">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6 lg:px-10">
              Built with Next.js and MDX. The sample app is{" "}
              <a className="text-accent underline underline-offset-2" href="https://github.com/keploy/samples-go/tree/main/gin-mongo" target="_blank" rel="noreferrer">
                keploy/samples-go/gin-mongo
              </a>
              .
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
