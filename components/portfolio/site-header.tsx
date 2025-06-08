"use client"
import Link from "next/link"
import { MainNav } from "@/components/portfolio/main-nav"
import { MobileNav } from "@/components/portfolio/mobile-nav"
import { EyeCatchingButton_v1 } from "@/components/portfolio/eye-catching-buttons"
import { Play, Globe, ChevronDown, Check } from "lucide-react"
import ThemeToggleButton from "@/components/ui/theme-toggle-button"
import { useState, useEffect } from "react"
import { cn, lt, preloadCurrentLocale, loadLocaleData } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Language names mapping for better UX
const languageNames: Record<string, string> = {
  af: "Afrikaans",
  ak: "Akan",
  am: "Amharic",
  ar: "العربية",
  as: "Assamese",
  ay: "Aymara",
  az: "Azərbaycan",
  be: "Беларуская",
  bg: "Български",
  bho: "Bhojpuri",
  bm: "Bamanankan",
  bn: "বাংলা",
  bs: "Bosanski",
  ca: "Català",
  ceb: "Cebuano",
  ckb: "کوردی",
  co: "Corsu",
  cs: "Čeština",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  dv: "Dhivehi",
  ee: "Eʋegbe",
  el: "Ελληνικά",
  en: "English",
  eo: "Esperanto",
  es: "Español",
  et: "Eesti",
  eu: "Euskera",
  fa: "فارسی",
  fi: "Suomi",
  fr: "Français",
  fy: "Frysk",
  ga: "Gaeilge",
  gd: "Gàidhlig",
  gl: "Galego",
  gn: "Guaraní",
  gu: "ગુજરાતી",
  ha: "Hausa",
  haw: "Hawaiian",
  he: "עברית",
  hi: "हिन्दी",
  hmn: "Hmong",
  hr: "Hrvatski",
  ht: "Kreyòl",
  hu: "Magyar",
  hy: "Հայերեն",
  id: "Indonesia",
  ig: "Igbo",
  is: "Íslenska",
  it: "Italiano",
  ja: "日本語",
  jw: "Basa Jawa",
  ka: "ქართული",
  kk: "Қазақша",
  km: "ខ្មែរ",
  kn: "ಕನ್ನಡ",
  ko: "한국어",
  kri: "Krio",
  ku: "Kurdî",
  ky: "Кыргызча",
  la: "Latina",
  lb: "Lëtzebuergesch",
  lg: "Luganda",
  ln: "Lingála",
  lo: "ລາວ",
  lt: "Lietuvių",
  lus: "Mizo",
  lv: "Latviešu",
  mai: "Maithili",
  mg: "Malagasy",
  mi: "Māori",
  mk: "Македонски",
  ml: "മലയാളം",
  mn: "Монгол",
  mr: "मराठी",
  ms: "Bahasa Melayu",
  mt: "Malti",
  my: "မြန်မာ",
  ne: "नेपाली",
  nl: "Nederlands",
  no: "Norsk",
  nso: "Sepedi",
  ny: "Chichewa",
  om: "Oromoo",
  or: "ଓଡ଼ିଆ",
  pa: "ਪੰਜਾਬੀ",
  pl: "Polski",
  ps: "پښتو",
  pt: "Português",
  qu: "Runasimi",
  ro: "Română",
  ru: "Русский",
  rw: "Kinyarwanda",
  sa: "संस्कृतम्",
  sd: "سنڌي",
  si: "සිංහල",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sm: "Gagana Samoa",
  sn: "ChiShona",
  so: "Soomaali",
  sq: "Shqip",
  sr: "Српски",
  st: "Sesotho",
  su: "Basa Sunda",
  sv: "Svenska",
  sw: "Kiswahili",
  ta: "தமிழ்",
  te: "తెలుగు",
  tg: "Тоҷикӣ",
  th: "ไทย",
  ti: "ትግርኛ",
  tk: "Türkmen",
  tl: "Filipino",
  tr: "Türkçe",
  ts: "Xitsonga",
  tt: "Татарча",
  tw: "Twi",
  ug: "ئۇيغۇرچە",
  uk: "Українська",
  ur: "اردو",
  uz: "O'zbek",
  vi: "Tiếng Việt",
  xh: "isiXhosa",
  yi: "ייִדיש",
  yo: "Yorùbá",
  zh: "中文",
  zu: "isiZulu",
};

// Define available locales - using all languages from customizer sidebar
const locales = [
  "af", "ak", "am", "ar", "as", "ay", "az", "be", "bg", "bho", "bm", "bn", "bs", 
  "ca", "ceb", "ckb", "co", "cs", "cy", "da", "de", "dv", "ee", "el", "en", "eo", 
  "es", "et", "eu", "fa", "fi", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "ha", 
  "haw", "he", "hi", "hmn", "hr", "ht", "hu", "hy", "id", "ig", "is", "it", "ja", 
  "jw", "ka", "kk", "km", "kn", "ko", "kri", "ku", "ky", "la", "lb", "lg", "ln", 
  "lo", "lt", "lus", "lv", "mai", "mg", "mi", "mk", "ml", "mn", "mr", "ms", "mt", 
  "my", "ne", "nl", "no", "nso", "ny", "om", "or", "pa", "pl", "ps", "pt", "qu", 
  "ro", "ru", "rw", "sa", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", 
  "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tr", "ts", 
  "tt", "tw", "ug", "uk", "ur", "uz", "vi", "xh", "yi", "yo", "zh", "zu"
];
const defaultLocale = "en";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Separate useEffect for locale loading to make it clearer
  useEffect(() => {
    // Reset loaded state when path changes
    setLoaded(false)
    
    const loadLocale = async () => {
      try {
        // Get locale from pathname
        const currentLocale = getCurrentLocale();
        await loadLocaleData(currentLocale as any)
        setLoaded(true)
      } catch (err) {
        console.error("Failed to load locale data:", err)
        setError(true)
        setLoaded(true)
      }
    }
    
    loadLocale()
  }, [pathname]) // Add pathname as dependency

  const getCurrentLocale = (): string => {
    if (!pathname) return defaultLocale;
    const segments = pathname.split("/");
    const localeFromPath = segments[1];
    return locales.includes(localeFromPath) ? localeFromPath : defaultLocale;
  };

  const redirectedPathname = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const currentLocale = getCurrentLocale();
  const currentLanguageName = languageNames[currentLocale] || currentLocale.toUpperCase();

  
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        scrolled && "border-b"
      )}
    >
      <div className="container flex h-14 max-w-screen-xl items-center mx-auto">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ThemeToggleButton
              showLabel
              variant="gif"
              url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
            />
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger className="flex items-center space-x-1 rounded-md border px-2 py-1.5 hover:bg-accent h-10 hover:text-primary">
                <Globe className="size-4" />
                <span className="text-sm">{currentLanguageName}</span>
                <ChevronDown className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0 z-[100000000000000000000000000000000000000000000000]">
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {locales.map((locale) => (
                        <CommandItem
                          key={locale}
                          value={`${locale} ${languageNames[locale] || locale}`}
                          onSelect={() => {
                            router.push(redirectedPathname(locale));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentLocale === locale ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-1 items-center justify-between">
                            <span>{languageNames[locale] || locale}</span>
                            <span className="text-xs text-muted-foreground">
                              {locale.toUpperCase()}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            <Link
              target="_blank"
              href={
                "https://www.facebook.com/tanvirhasan.bijoy.16"
              }
            >
              <EyeCatchingButton_v1 className="group">
                <Play className="mr-1 size-4 group-hover:text-primary text-foreground" />
                <span className="group-hover:text-primary text-sm text-foreground truncate max-w-[60px] sm:max-w-[100px] md:max-w-full whitespace-nowrap">
                  {loaded ? (error ? "Start a Project" : lt("start-project")) : "Start a Project"}
                </span>
              </EyeCatchingButton_v1>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
