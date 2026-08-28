import { BookOpenIcon, ClipboardListIcon, UserRoundCheckIcon } from "lucide-react";

import { HomeHeroCarousel } from "@/components/public-site/home-hero-carousel";
import { QuranAyahTicker } from "@/components/public-site/quran-ayah-ticker";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const journeyIcons = [ClipboardListIcon, UserRoundCheckIcon, BookOpenIcon];

export function HomeHero({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const slides = dictionary.home.heroSlides ?? [{
    title: dictionary.home.heroTitle,
    description: dictionary.home.heroDescription,
    imageAlt: dictionary.home.heroImageAlt,
  }];
  const labels = dictionary.home.heroCarousel ?? {
    label: "Featured learning journeys",
    previous: "Previous slide",
    next: "Next slide",
    pause: "Pause slides",
    play: "Play slides",
    goToSlide: "Go to slide",
  };

  return (
    <>
      <HomeHeroCarousel
        locale={locale}
        slides={slides}
        labels={labels}
        bookTrialLabel={dictionary.common.bookTrial}
        exploreCoursesLabel={dictionary.common.exploreCourses}
      />

      <QuranAyahTicker locale={locale} />

      <section id="how-it-works" className="border-b border-border/70 bg-warm-surface">
        <h2 className="sr-only">{dictionary.home.howItWorksTitle}</h2>
        <ol className="mx-auto grid max-w-7xl px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {dictionary.home.steps.map((step, index) => {
            const Icon = journeyIcons[index] ?? BookOpenIcon;
            return (
              <li
                key={step.title}
                data-premium-hover="rail"
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-border/80 py-6 last:border-b-0 lg:border-e lg:border-b-0 lg:px-8 lg:first:ps-0 lg:last:border-e-0 lg:last:pe-0"
              >
                <span data-hover-icon className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-heading text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
