"use client"

import { Toaster as DefaultToaster, Toaster as NewYorkToaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster as NewYorkSonner } from "@/components/ui/sonner"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeSync } from "@/components/theme/theme-sync";
import { SiteHeader } from "@/components/portfolio/site-header"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as JotaiProvider } from "jotai"
import * as React from "react"
import { Suspense } from "react"
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <JotaiProvider>
              <NextThemesProvider {...props}>
                <TooltipProvider>
                  <SiteHeader />

                  {children}
                  <ThemeSync />
                  <NewYorkToaster />
                  <DefaultToaster />
                  <NewYorkSonner />
                </TooltipProvider>
              </NextThemesProvider>
            </JotaiProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </Suspense>
    </QueryClientProvider>
  )
}

