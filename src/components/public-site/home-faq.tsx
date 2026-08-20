import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function HomeFaq({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            {dictionary.home.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {dictionary.home.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-5 text-start text-base hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-muted-foreground sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="admission" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-20">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {dictionary.home.finalTitle}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-primary-foreground/75">
              {dictionary.home.finalDescription}
            </p>
          </div>
          <Button size="xl" variant="gold" asChild>
            <Link href={`/${locale}/free-trial`}>
              {dictionary.common.bookTrial}
              <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
