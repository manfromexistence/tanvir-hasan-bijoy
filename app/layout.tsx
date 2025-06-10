import { i18n, type Locale } from "@/i18n-config";
import { LoadTheme } from "@/components/theme/load-theme";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tanvir Hasan Bijoy",
    template: "%s | Tanvir Hasan Bijoy",
  },
  description: "Portfolio website for Tanvir Hasan Bijoy, a graphics designer and detailer.",
  keywords: [
    "tanvir hasan bijoy",
    "graphics designer",
    "portfolio",
    "detailer",
    "art",
    "design",
    "creative",
    "manfromexistence",
  ],
  authors: [
    {
      name: "Tanvir Hasan Bijoy",
      url: "https://manfromexistence.vercel.app",
    },
  ],
  creator: "Tanvir Hasan Bijoy",
  metadataBase: new URL("https://themux.vercel.app"),
  openGraph: {
    title: "Tanvir Hasan Bijoy | Portfolio of a Graphics Designer & Detailer",
    description: "Explore the portfolio of Tanvir Hasan Bijoy, showcasing work as a graphics designer and detailer.",
  },
  generator: "Next.js",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <LoadTheme />
      </head>
      <body className={cn(`antialiased w-full min-h-screen relative px-4 md:px-6 lg:px-8`)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

