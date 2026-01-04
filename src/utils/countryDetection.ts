import type { Country } from '@/pages/PhoneLoginPage/countries';
import { countries } from '@/pages/PhoneLoginPage/countries';

/**
 * Detects user's country based on browser locale and IP geolocation
 * @returns Detected country or null if detection fails
 */
export async function detectUserCountry(): Promise<Country | null> {
  try {
    // First, try to detect from browser locale
    const browserLocale = navigator.language || (navigator as any).userLanguage;
    const localeCountryCode = browserLocale.split('-')[1]?.toUpperCase();
    
    if (localeCountryCode) {
      const countryFromLocale = countries.find(
        c => c.code.toUpperCase() === localeCountryCode
      );
      if (countryFromLocale) {
        console.log('🌍 Country detected from browser locale:', countryFromLocale.name);
        return countryFromLocale;
      }
    }
    
    // Fallback to IP geolocation
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const detectedCountry = data.country_name || data.country || data.countryName || data.country_name_eng;
      const detectedCountryCode = data.country_code || data.country_code_iso3 || data.countryCode || data.country_code_iso2;
      
      if (detectedCountryCode) {
        const countryFromIP = countries.find(
          c => c.code.toUpperCase() === detectedCountryCode.toUpperCase() || 
               c.name.toLowerCase() === detectedCountry?.toLowerCase()
        );
        
        if (countryFromIP) {
          console.log('🌍 Country detected from IP geolocation:', countryFromIP.name);
          return countryFromIP;
        }
      }
    } catch (ipError) {
      console.log('⚠️ IP geolocation failed, using default country');
    }
    
    return null;
  } catch (error) {
    console.log('❌ Error detecting country from browser locale:', error);
    return null;
  }
}

