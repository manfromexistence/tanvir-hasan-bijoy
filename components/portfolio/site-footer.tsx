"use client"

import { useEffect, useState } from "react"
import { siteConfig } from "@/config/site"
import { lt, preloadCurrentLocale } from "@/lib/utils"

export function SiteFooter() {
  const [loaded, setLoaded] = useState(false)

  // Preload locale data when component mounts
  useEffect(() => {
    preloadCurrentLocale().then(() => {
      setLoaded(true)
    })
  }, [])

  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          {loaded
            ? lt("footer-copyright")
            : "Last updated 06/03/2025. Thanks for visiting my portfolio."}
        </p>
      </div>
    </footer>
  )
}

