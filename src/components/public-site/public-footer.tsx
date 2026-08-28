import Link from "next/link";
import { ArrowRightIcon, MailIcon } from "lucide-react";

import { AcademyBrand } from "@/components/brand/academy-brand";
import { Separator } from "@/components/ui/separator";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const footerFallback: Record<Locale, Dictionary["common"]["footer"]> = {
  en: {
    resources: "Student resources",
    howItWorks: "How it works",
    learningPlans: "Learning plans",
    safeguarding: "Safeguarding",
    freeTrial: "Free trial",
    contactAcademy: "Contact the academy",
  },
  ur: {
    resources: "طلبہ کے وسائل",
    howItWorks: "طریقۂ کار",
    learningPlans: "تعلیمی منصوبے",
    safeguarding: "تحفظ",
    freeTrial: "مفت آزمائشی سبق",
    contactAcademy: "اکیڈمی سے رابطہ کریں",
  },
  ar: {
    resources: "موارد الطلاب",
    howItWorks: "كيف نعمل",
    learningPlans: "خطط التعلّم",
    safeguarding: "الحماية",
    freeTrial: "حصة تجريبية مجانية",
    contactAcademy: "تواصل مع الأكاديمية",
  },
  fa: {
    resources: "منابع دانش‌آموزان",
    howItWorks: "روش کار",
    learningPlans: "برنامه‌های آموزشی",
    safeguarding: "حفاظت از دانش‌آموزان",
    freeTrial: "جلسه آزمایشی رایگان",
    contactAcademy: "تماس با آکادمی",
  },
};

export function PublicFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const footer = dictionary.common.footer ?? footerFallback[locale];

  return (
    <footer className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-[1.2fr_0.65fr_0.85fr_0.85fr_1fr]">
          <div className="max-w-sm">
            <AcademyBrand href={`/${locale}`} name={dictionary.common.brandName} inverse />
            <p className="mt-5 text-sm leading-7 text-sidebar-foreground/60">
              {dictionary.home.heroDescription}
            </p>
          </div>

          <nav aria-label={dictionary.common.menu}>
            <h2 className="font-heading text-sm font-semibold tracking-wide text-sidebar-foreground">
              {dictionary.common.menu}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-sidebar-foreground/60">
              {dictionary.common.navigation.map((item) => (
                <li key={item.href || "home"}>
                  <Link href={`/${locale}${item.href}`} className="transition-colors hover:text-sidebar-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold tracking-wide text-sidebar-foreground">
              {dictionary.home.popularCoursesTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-sidebar-foreground/60">
              {dictionary.home.courses.slice(0, 4).map((course) => (
                <li key={course.title}>
                  <Link href={`/${locale}/courses`} className="transition-colors hover:text-sidebar-foreground">
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold tracking-wide text-sidebar-foreground">
              {footer.resources}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-sidebar-foreground/60">
              <li><Link href={`/${locale}/how-it-works`} className="transition-colors hover:text-sidebar-foreground">{footer.howItWorks}</Link></li>
              <li><Link href={`/${locale}/pricing`} className="transition-colors hover:text-sidebar-foreground">{footer.learningPlans}</Link></li>
              <li><Link href={`/${locale}/safeguarding`} className="transition-colors hover:text-sidebar-foreground">{footer.safeguarding}</Link></li>
              <li><Link href={`/${locale}/free-trial`} className="transition-colors hover:text-sidebar-foreground">{footer.freeTrial}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold tracking-wide text-sidebar-foreground">
              {dictionary.home.finalTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-sidebar-foreground/60">
              {dictionary.home.finalDescription}
            </p>
            <Link
              href={`/${locale}/free-trial`}
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-sidebar-foreground"
            >
              {dictionary.common.bookTrial}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link href={`/${locale}/contact`} className="mt-4 flex items-center gap-2 text-sm text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground">
              <MailIcon className="size-4 text-gold" aria-hidden="true" />
              {footer.contactAcademy}
            </Link>
          </div>
        </div>

        <Separator className="my-10 bg-sidebar-border" />
        <div className="flex flex-col gap-3 text-sm text-sidebar-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getUTCFullYear()} {dictionary.common.brandName}</p>
          <div className="flex flex-wrap gap-5"><Link href={`/${locale}/privacy`} className="transition-colors hover:text-sidebar-foreground">Privacy</Link><Link href={`/${locale}/terms`} className="transition-colors hover:text-sidebar-foreground">Terms</Link><Link href={`/${locale}/safeguarding`} className="transition-colors hover:text-sidebar-foreground">Safeguarding</Link><Link href={`/${locale}/become-a-tutor`} className="transition-colors hover:text-sidebar-foreground">Apply as tutor</Link><Link href={`/${locale}/login`} className="transition-colors hover:text-sidebar-foreground">{dictionary.common.signIn}</Link></div>
        </div>
      </div>
    </footer>
  );
}
