export type CountryOption = {
  name: string;
  iso2: string;
  flag: string;
  dialCode: string;
};

type RawCountry = {
  name?: unknown;
  alpha2Code?: unknown;
  flag?: unknown;
  callingCodes?: unknown;
};

function flagFromIso2(iso2: string) {
  return String.fromCodePoint(...iso2.split("").map((letter) => 127397 + letter.charCodeAt(0)));
}

export function normalizeCountries(payload: unknown): CountryOption[] {
  if (!Array.isArray(payload)) return [];

  const countries = payload.flatMap((entry): CountryOption[] => {
    const country = entry as RawCountry;
    const name = typeof country.name === "string" ? country.name.trim() : "";
    const iso2 = typeof country.alpha2Code === "string" ? country.alpha2Code.trim().toUpperCase() : "";
    const dialCode = Array.isArray(country.callingCodes)
      ? String(country.callingCodes.find((code) => typeof code === "string") ?? "").replace(/\D/g, "")
      : "";

    if (!name || !/^[A-Z]{2}$/.test(iso2)) return [];

    return [{
      name,
      iso2,
      flag: typeof country.flag === "string" && country.flag.trim() ? country.flag.trim() : flagFromIso2(iso2),
      dialCode,
    }];
  });

  return [...new Map(countries.map((country) => [country.iso2, country])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function applyDialCode(phone: string, nextDialCode: string, previousDialCode = "") {
  const value = phone.trim();
  const nextPrefix = nextDialCode ? `+${nextDialCode}` : "";
  const previousPrefix = previousDialCode ? `+${previousDialCode}` : "";

  if (!value) return nextPrefix;
  if (!nextPrefix) return value;
  if (previousPrefix && value.startsWith(previousPrefix)) {
    return `${nextPrefix}${value.slice(previousPrefix.length).trimStart()}`;
  }
  if (value.startsWith("+")) return value;

  return `${nextPrefix}${value.replace(/^0+/, "")}`;
}
