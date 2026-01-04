/**
 * Formats phone number by ensuring country code is included
 * @param phoneNumber - Raw phone number input
 * @param countryCode - Country dial code
 * @returns Formatted phone number with country code
 */
export function formatPhoneNumberWithCountryCode(
  phoneNumber: string,
  countryCode: string
): string {
  // Remove any existing country code
  let cleaned = phoneNumber.replace(/^\+\d{1,4}\s*/, '').trim();
  
  // If phone number doesn't start with country code, add it
  if (!phoneNumber.startsWith(countryCode)) {
    cleaned = countryCode + ' ' + cleaned;
  }
  
  return cleaned;
}

/**
 * Extracts phone number without country code
 * @param phoneNumber - Full phone number with country code
 * @param countryCode - Country dial code to remove
 * @returns Phone number without country code
 */
export function extractPhoneNumberWithoutCode(
  phoneNumber: string,
  countryCode: string
): string {
  return phoneNumber.replace(new RegExp(`^\\+?${countryCode.replace('+', '')}\\s*`), '').trim();
}

