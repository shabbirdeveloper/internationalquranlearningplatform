"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { CountryOption } from "@/lib/countries";
import { cn } from "@/lib/utils";

type CountryApiResponse = { countries?: CountryOption[] };

const countryUiCopy: Record<Locale, { select: string; loading: string; dialCode: string }> = {
  en: { select: "Select a country", loading: "Loading countries…", dialCode: "Country calling code" },
  ur: { select: "ملک منتخب کریں", loading: "ممالک لوڈ ہو رہے ہیں…", dialCode: "ملکی فون کوڈ" },
  ar: { select: "اختر البلد", loading: "جارٍ تحميل البلدان…", dialCode: "رمز الاتصال الدولي" },
};

let countryRequest: Promise<CountryOption[]> | null = null;

function requestCountries() {
  countryRequest ??= fetch("/api/countries")
    .then(async (response) => {
      if (!response.ok) throw new Error("Could not load countries");
      const payload = (await response.json()) as CountryApiResponse;
      return Array.isArray(payload.countries) ? payload.countries : [];
    })
    .catch(() => []);
  return countryRequest;
}

export function useCountryOptions() {
  const [countries, setCountries] = useState<CountryOption[]>([]);

  useEffect(() => {
    let active = true;
    void requestCountries().then((options) => {
      if (active) setCountries(options);
    });
    return () => {
      active = false;
    };
  }, []);

  return countries;
}

export function CountrySelectControl({
  id,
  locale,
  countries,
  value,
  onChange,
  required = false,
  invalid = false,
  name,
  optionValue = "iso2",
  className,
}: {
  id: string;
  locale: Locale;
  countries: CountryOption[];
  value: string;
  onChange: (iso2: string) => void;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  optionValue?: "iso2" | "country-and-dial";
  className?: string;
}) {
  const copy = countryUiCopy[locale];
  const selectedCountry = countries.find((country) => country.iso2 === value);
  const selectedValue = optionValue === "country-and-dial" && selectedCountry
    ? `${selectedCountry.iso2}:${selectedCountry.dialCode}`
    : value;
  return (
    <select
      id={id}
      name={name}
      value={selectedValue}
      onChange={(event) => onChange(event.target.value.split(":")[0] ?? "")}
      required={required}
      aria-invalid={invalid}
      disabled={!countries.length}
      autoComplete="country"
      className={cn(
        "h-12 w-full min-w-0 rounded-[0.875rem] border border-input bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
    >
      <option value="">{countries.length ? copy.select : copy.loading}</option>
      {countries.map((country) => (
        <option key={country.iso2} value={optionValue === "country-and-dial" ? `${country.iso2}:${country.dialCode}` : country.iso2}>
          {country.flag} {country.name}{country.dialCode ? ` (+${country.dialCode})` : ""}
        </option>
      ))}
    </select>
  );
}

export function PublicCountryPhoneControls({
  locale,
  countryLabel,
  phoneLabel,
  phoneRequired,
  showCountryField,
  countryError,
  phoneError,
}: {
  locale: Locale;
  countryLabel: string;
  phoneLabel: string;
  phoneRequired: boolean;
  showCountryField: boolean;
  countryError?: string[];
  phoneError?: string[];
}) {
  const countries = useCountryOptions();
  const [countryCode, setCountryCode] = useState("");
  const selectedCountry = countries.find((country) => country.iso2 === countryCode);

  function changeCountry(nextCountryCode: string) {
    setCountryCode(nextCountryCode);
  }

  return (
    <>
      {showCountryField ? (
        <div data-slot="field" data-invalid={Boolean(countryError)} className="group/field grid gap-2">
          <label data-slot="field-label" htmlFor="countryCode">
            {countryLabel}<span aria-hidden="true" className="text-primary">*</span>
          </label>
          <CountrySelectControl
            id="countryCode"
            locale={locale}
            countries={countries}
            value={countryCode}
            onChange={changeCountry}
            required
            invalid={Boolean(countryError)}
          />
          <input type="hidden" name="country" value={selectedCountry?.name ?? ""} />
          {countryError?.map((message) => <p key={message} className="text-sm text-destructive">{message}</p>)}
        </div>
      ) : null}

      <div data-slot="field" data-invalid={Boolean(phoneError)} className="group/field grid gap-2">
        <label data-slot="field-label" htmlFor="phone">
          {phoneLabel}{phoneRequired ? <span aria-hidden="true" className="text-primary">*</span> : null}
        </label>
        <div className="grid min-w-0 grid-cols-[minmax(7.5rem,0.72fr)_minmax(0,1.28fr)] gap-2">
          <CountrySelectControl
            id="phoneCountryCode"
            name="phoneCountry"
            locale={locale}
            countries={countries}
            value={countryCode}
            onChange={changeCountry}
            optionValue="country-and-dial"
            required={phoneRequired}
            invalid={Boolean(phoneError)}
            className="px-3"
          />
          <div className="flex min-w-0 rounded-[0.875rem] border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span data-phone-prefix className="flex min-w-14 items-center justify-center border-e border-input px-3 text-sm font-semibold text-primary">
              {selectedCountry?.dialCode ? `+${selectedCountry.dialCode}` : "+"}
            </span>
            <Input
              id="phone"
              name="phoneLocal"
              type="text"
              inputMode="tel"
              autoComplete="tel-national"
              required={phoneRequired}
              aria-invalid={Boolean(phoneError)}
              placeholder="Phone number"
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
        </div>
        <span className="sr-only">{countryUiCopy[locale].dialCode}</span>
        {phoneError?.map((message) => <p key={message} className="text-sm text-destructive">{message}</p>)}
      </div>
    </>
  );
}
