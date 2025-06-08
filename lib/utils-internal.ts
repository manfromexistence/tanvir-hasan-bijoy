import { Locale } from '@/i18n-config';

// Type definitions for locale text structure
export type LocaleKeys = {
  friday?: {
    title: string;
    welcome: string;
    prompt: string;
    help: string;
  };
  navigation?: {
    new: string;
    home: string;
    automations: string;
    varients: string;
    projects: string;
    spaces: string;
    library: string;
    more: string;
    settings: string;
    profile: string;
    dashboard: string;
    analytics: string;
  };
  [key: string]: any;
};

// Global locale cache
let localeCache: Partial<Record<Locale, LocaleKeys>> = {};

/**
 * Load locale data dynamically
 */
export async function loadLocaleData(locale: Locale): Promise<LocaleKeys> {
  if (localeCache[locale]) {
    return localeCache[locale]!;
  }

  try {
    const localeData = await import(`@/locales/${locale}.json`);
    localeCache[locale] = localeData.default;
    return localeData.default;
  } catch (error) {
    console.warn(`Failed to load locale ${locale}, falling back to English`);
    // Fallback to English
    if (!localeCache.en) {
      const fallback = await import('@/locales/en.json');
      localeCache.en = fallback.default;
    }
    return localeCache.en!;
  }
}

/**
 * Get nested value from object using dot notation
 */
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
