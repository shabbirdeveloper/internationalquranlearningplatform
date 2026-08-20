import type { ReactNode } from "react";

export function PublicPageHero({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <section className="relative min-w-0 overflow-hidden border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(30deg,white_1px,transparent_1px),linear-gradient(150deg,white_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-y-0 end-0 w-2/5 bg-gradient-to-l from-sidebar/25 to-transparent" />
      <div className="relative mx-auto min-w-0 max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-24">
        <div className="mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          <p className="max-w-full break-words text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:tracking-[0.22em]">{eyebrow}</p>
        </div>
        <h1 className="max-w-full break-words font-heading text-3xl leading-[1.08] font-semibold tracking-[-0.04em] [overflow-wrap:anywhere] sm:max-w-4xl sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-full break-words text-base leading-7 text-primary-foreground/75 sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
