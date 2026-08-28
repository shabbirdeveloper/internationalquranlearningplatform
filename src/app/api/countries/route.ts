import { normalizeCountries, type CountryOption } from "@/lib/countries";

const COUNTRY_API_URL =
  "https://countries.dev/countries?fields=name,alpha2Code,flag,callingCodes&sort=name";

const fallbackCountries: CountryOption[] = [
  { name: "Australia", iso2: "AU", flag: "🇦🇺", dialCode: "61" },
  { name: "Bahrain", iso2: "BH", flag: "🇧🇭", dialCode: "973" },
  { name: "Canada", iso2: "CA", flag: "🇨🇦", dialCode: "1" },
  { name: "France", iso2: "FR", flag: "🇫🇷", dialCode: "33" },
  { name: "Germany", iso2: "DE", flag: "🇩🇪", dialCode: "49" },
  { name: "India", iso2: "IN", flag: "🇮🇳", dialCode: "91" },
  { name: "Iran", iso2: "IR", flag: "🇮🇷", dialCode: "98" },
  { name: "Iraq", iso2: "IQ", flag: "🇮🇶", dialCode: "964" },
  { name: "Malaysia", iso2: "MY", flag: "🇲🇾", dialCode: "60" },
  { name: "New Zealand", iso2: "NZ", flag: "🇳🇿", dialCode: "64" },
  { name: "Pakistan", iso2: "PK", flag: "🇵🇰", dialCode: "92" },
  { name: "Saudi Arabia", iso2: "SA", flag: "🇸🇦", dialCode: "966" },
  { name: "United Arab Emirates", iso2: "AE", flag: "🇦🇪", dialCode: "971" },
  { name: "United Kingdom", iso2: "GB", flag: "🇬🇧", dialCode: "44" },
  { name: "United States", iso2: "US", flag: "🇺🇸", dialCode: "1" },
];

export const revalidate = 86_400;

export async function GET() {
  try {
    const response = await fetch(COUNTRY_API_URL, {
      next: { revalidate },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Country API returned ${response.status}`);

    const countries = normalizeCountries(await response.json());
    if (countries.length < 200) throw new Error("Country API returned an incomplete list");

    return Response.json(
      { countries, source: "countries.dev" },
      { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return Response.json(
      { countries: fallbackCountries, source: "fallback" },
      { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
    );
  }
}
