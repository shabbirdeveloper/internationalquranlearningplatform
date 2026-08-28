"use client";

import { ImagesIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ManagedContentImage } from "@/components/public-site/managed-content-image";
import type { Locale } from "@/i18n/config";
import type { GalleryItem } from "@/server/repositories/content-library-repository";

const labels = { en: { all: "All", empty: "No moments in this category yet" }, ur: { all: "تمام", empty: "اس زمرے میں ابھی کوئی تصویر نہیں" }, ar: { all: "الكل", empty: "لا توجد لحظات في هذه الفئة بعد" }, fa: { all: "همه", empty: "هنوز تصویری در این دسته وجود ندارد" } } as const;

export function GalleryLibrary({ items, locale }: { items: GalleryItem[]; locale: Locale }) {
  const allLabel = labels[locale].all;
  const categories = useMemo(() => [allLabel, ...Array.from(new Set(items.map((item) => item.category)))], [allLabel, items]);
  const [category, setCategory] = useState<string>(allLabel);
  const filtered = category === allLabel ? items : items.filter((item) => item.category === category);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-9 flex flex-wrap gap-2" aria-label="Filter gallery">
        {categories.map((item) => <Button key={item} variant={category === item ? "default" : "outline"} size="sm" onClick={() => setCategory(item)}>{item}</Button>)}
      </div>
      {filtered.length ? <div className="grid auto-rows-[16rem] gap-5 md:grid-cols-2 lg:auto-rows-[19rem] lg:grid-cols-3">
        {filtered.map((item, index) => <article key={item.id} className={`public-interactive-card group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-sidebar ${index === 0 && filtered.length > 2 ? "md:row-span-2 lg:col-span-2" : ""}`}>
          <ManagedContentImage src={item.image_url} alt={item.image_alt} sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-sidebar-foreground sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{item.category}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold sm:text-2xl">{item.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-sidebar-foreground/75">{item.caption}</p>
          </div>
        </article>)}
      </div> : <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed text-center"><ImagesIcon className="size-10 text-muted-foreground" /><h2 className="mt-4 font-heading text-2xl font-semibold">{labels[locale].empty}</h2></div>}
    </section>
  );
}
