"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveIcon, CopyIcon, EyeIcon, EyeOffIcon, PencilIcon, PlusIcon, SaveIcon, SearchIcon, StarIcon, Trash2Icon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  archivePricingPackageAction,
  duplicatePricingPackageAction,
  saveCurrencyAction,
  savePricingPackageAction,
  savePricingPageContentAction,
  togglePricingPackageAction,
  type PricingActionState,
} from "@/features/pricing/actions";
import type { Locale } from "@/i18n/config";
import type { PricingCurrency, PricingData, PricingPackage } from "@/server/repositories/pricing-repository";

type PackageDraft = Omit<PricingPackage, "id" | "features" | "prices" | "deleted_at" | "badge_text"> & {
  id: string | null;
  badge_text: string;
  features: Array<{ id?: string; feature_text: string; display_order: number; is_active: boolean }>;
  prices: Array<{ id?: string; currency_code: string; amount: number; is_active: boolean }>;
};

const initialActionState: PricingActionState = {};

function newPackage(currencies: PricingCurrency[]): PackageDraft {
  return {
    id: null,
    slug: "",
    title: "",
    description: "",
    classes_per_month: 4,
    class_duration_minutes: 30,
    class_type: "One-to-one class",
    badge_text: "",
    is_featured: false,
    cta_label: "Get Admission Now",
    cta_url: "/free-trial",
    billing_period_label: "/month",
    display_order: 10,
    is_active: true,
    features: [{ feature_text: "Live one-to-one classes", display_order: 10, is_active: true }],
    prices: currencies.map((currency) => ({ currency_code: currency.code, amount: 0, is_active: currency.is_active })),
  };
}

function fromPackage(pricingPackage: PricingPackage): PackageDraft {
  return {
    ...pricingPackage,
    badge_text: pricingPackage.badge_text ?? "",
    features: pricingPackage.features.map((feature) => ({ ...feature })),
    prices: pricingPackage.prices.map((price) => ({ ...price })),
  };
}

function PackageEditor({ locale, currencies, draft, open, onOpenChange }: {
  locale: Locale;
  currencies: PricingCurrency[];
  draft: PackageDraft;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(draft);
  const [state, action, pending] = useActionState(savePricingPackageAction, initialActionState);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      router.refresh();
    }
  }, [onOpenChange, router, state.success]);

  function update<K extends keyof PackageDraft>(key: K, next: PackageDraft[K]) {
    setValue((current) => ({ ...current, [key]: next }));
  }

  function updateFeature(index: number, next: Partial<PackageDraft["features"][number]>) {
    update("features", value.features.map((feature, featureIndex) => featureIndex === index ? { ...feature, ...next } : feature));
  }

  function updatePrice(code: string, next: Partial<PackageDraft["prices"][number]>) {
    const exists = value.prices.some((price) => price.currency_code === code);
    update("prices", exists
      ? value.prices.map((price) => price.currency_code === code ? { ...price, ...next } : price)
      : [...value.prices, { currency_code: code, amount: 0, is_active: true, ...next }]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{value.id ? "Edit pricing package" : "Create pricing package"}</DialogTitle>
          <DialogDescription>Package details, features, currency prices, visibility, and public card preview.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-6">
          <input type="hidden" name="payload" value={JSON.stringify({ ...value, locale })} />
          {state.error ? <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert> : null}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
            <div className="flex flex-col gap-6">
              <FieldSet><FieldLegend>Package details</FieldLegend><FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field><FieldLabel htmlFor="package-title">Package title</FieldLabel><Input id="package-title" value={value.title} onChange={(event) => update("title", event.target.value)} required /></Field>
                  <Field><FieldLabel htmlFor="package-slug">URL-safe key</FieldLabel><Input id="package-slug" value={value.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required /><FieldDescription>Lowercase letters, numbers, and hyphens.</FieldDescription></Field>
                </div>
                <Field><FieldLabel htmlFor="package-description">Short description</FieldLabel><Textarea id="package-description" value={value.description} onChange={(event) => update("description", event.target.value)} required /></Field>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field><FieldLabel htmlFor="classes-month">Classes/month</FieldLabel><Input id="classes-month" type="number" min={1} max={100} value={value.classes_per_month} onChange={(event) => update("classes_per_month", Number(event.target.value))} required /></Field>
                  <Field><FieldLabel htmlFor="duration">Minutes/class</FieldLabel><Input id="duration" type="number" min={15} max={180} value={value.class_duration_minutes} onChange={(event) => update("class_duration_minutes", Number(event.target.value))} required /></Field>
                  <Field><FieldLabel htmlFor="class-type">Class type</FieldLabel><Input id="class-type" value={value.class_type} onChange={(event) => update("class_type", event.target.value)} required /></Field>
                  <Field><FieldLabel htmlFor="display-order">Display order</FieldLabel><Input id="display-order" type="number" min={0} max={10000} value={value.display_order} onChange={(event) => update("display_order", Number(event.target.value))} required /></Field>
                </div>
              </FieldGroup></FieldSet>

              <FieldSet><div className="flex items-center justify-between gap-3"><FieldLegend>Features</FieldLegend><Button type="button" variant="outline" size="sm" onClick={() => update("features", [...value.features, { feature_text: "", display_order: (value.features.length + 1) * 10, is_active: true }])}><PlusIcon />Add feature</Button></div><FieldGroup>
                {value.features.map((feature, index) => <div key={feature.id ?? index} className="grid grid-cols-[minmax(0,1fr)_5rem_auto] items-end gap-2"><Field><FieldLabel htmlFor={`feature-${index}`}>Feature {index + 1}</FieldLabel><Input id={`feature-${index}`} value={feature.feature_text} onChange={(event) => updateFeature(index, { feature_text: event.target.value })} required /></Field><Field><FieldLabel htmlFor={`feature-order-${index}`}>Order</FieldLabel><Input id={`feature-order-${index}`} type="number" min={0} value={feature.display_order} onChange={(event) => updateFeature(index, { display_order: Number(event.target.value) })} /></Field><Button type="button" variant="ghost" size="icon" onClick={() => update("features", value.features.filter((_, featureIndex) => featureIndex !== index))}><Trash2Icon /><span className="sr-only">Remove feature</span></Button></div>)}
              </FieldGroup></FieldSet>

              <FieldSet><FieldLegend>Currency prices</FieldLegend><FieldDescription>Every active currency with an enabled price appears on the public card.</FieldDescription><FieldGroup>
                {currencies.map((currency) => { const price = value.prices.find((item) => item.currency_code === currency.code) ?? { currency_code: currency.code, amount: 0, is_active: false }; return <div key={currency.code} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-3 rounded-xl border p-3"><div className="pb-2"><p className="font-semibold">{currency.code}</p><p className="text-xs text-muted-foreground">{currency.symbol} · {currency.name}</p></div><Field><FieldLabel htmlFor={`price-${currency.code}`}>Monthly amount</FieldLabel><Input id={`price-${currency.code}`} type="number" min={0} max={1000000} step="0.01" value={price.amount} onChange={(event) => updatePrice(currency.code, { amount: Number(event.target.value) })} /></Field><Field orientation="horizontal" className="pb-2"><Checkbox id={`price-active-${currency.code}`} checked={price.is_active} onCheckedChange={(checked) => updatePrice(currency.code, { is_active: checked === true })} /><FieldLabel htmlFor={`price-active-${currency.code}`}>Show</FieldLabel></Field></div>; })}
              </FieldGroup></FieldSet>

              <FieldSet><FieldLegend>Call to action and visibility</FieldLegend><FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="cta-label">Button label</FieldLabel><Input id="cta-label" value={value.cta_label} onChange={(event) => update("cta_label", event.target.value)} required /></Field><Field><FieldLabel htmlFor="cta-url">Button path</FieldLabel><Input id="cta-url" value={value.cta_url} onChange={(event) => update("cta_url", event.target.value)} required /></Field></div>
                <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="billing-label">Billing suffix</FieldLabel><Input id="billing-label" value={value.billing_period_label} onChange={(event) => update("billing_period_label", event.target.value)} required /></Field><Field><FieldLabel htmlFor="badge-text">Badge text</FieldLabel><Input id="badge-text" value={value.badge_text} onChange={(event) => update("badge_text", event.target.value)} /></Field></div>
                <div className="grid gap-3 sm:grid-cols-2"><Field orientation="horizontal"><Checkbox id="featured" checked={value.is_featured} onCheckedChange={(checked) => update("is_featured", checked === true)} /><FieldLabel htmlFor="featured">Featured package</FieldLabel></Field><Field orientation="horizontal"><Checkbox id="active" checked={value.is_active} onCheckedChange={(checked) => update("is_active", checked === true)} /><FieldLabel htmlFor="active">Visible on public page</FieldLabel></Field></div>
              </FieldGroup></FieldSet>
            </div>

            <div className="xl:sticky xl:top-0 xl:self-start"><Card className="bg-sidebar text-sidebar-foreground ring-gold"><CardHeader><Badge className="w-fit bg-gold text-sidebar">Preview</Badge><CardTitle className="text-2xl text-sidebar-foreground">{value.title || "Package title"}</CardTitle><CardDescription className="text-sidebar-foreground/70">{value.description || "Your public package description."}</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><p>{value.class_duration_minutes} minute class · {value.class_type}</p><ul className="flex flex-col gap-2 text-sm">{value.features.filter((feature) => feature.feature_text).map((feature, index) => <li key={index}>✓ {feature.feature_text}</li>)}</ul><div className="rounded-lg bg-sidebar-accent p-3">{value.prices.filter((price) => price.is_active).slice(0, 3).map((price) => <p key={price.currency_code}>{price.currency_code} · {price.amount.toFixed(2)}{value.billing_period_label}</p>)}</div></CardContent></Card></div>
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <SaveIcon />}{pending ? "Saving…" : "Save package"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PackagesTab({ locale, data }: { locale: Locale; data: PricingData }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PackageDraft>(() => newPackage(data.currencies));
  const packages = useMemo(() => data.packages.filter((item) => {
    const matchesSearch = `${item.title} ${item.slug}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || (status === "active" && item.is_active && !item.deleted_at) || (status === "inactive" && !item.is_active && !item.deleted_at) || (status === "archived" && Boolean(item.deleted_at));
    return matchesSearch && matchesStatus;
  }), [data.packages, search, status]);

  function openCreate() { setDraft(newPackage(data.currencies)); setOpen(true); }
  function openEdit(item: PricingPackage) { setDraft(fromPackage(item)); setOpen(true); }

  return <div className="flex flex-col gap-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search packages" className="ps-9" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectGroup></SelectContent></Select><Button onClick={openCreate}><PlusIcon />New package</Button></div><Card><CardContent className="overflow-x-auto p-0">{packages.length ? <Table><TableHeader><TableRow><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead>Classes</TableHead><TableHead>Prices</TableHead><TableHead>Order</TableHead><TableHead className="text-end">Actions</TableHead></TableRow></TableHeader><TableBody>{packages.map((item) => <TableRow key={item.id}><TableCell><div className="flex items-center gap-2"><div><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.slug}</p></div>{item.is_featured ? <StarIcon className="size-4 fill-gold text-gold" /> : null}</div></TableCell><TableCell><Badge variant={item.deleted_at ? "outline" : item.is_active ? "default" : "secondary"}>{item.deleted_at ? "Archived" : item.is_active ? "Active" : "Inactive"}</Badge></TableCell><TableCell>{item.classes_per_month}/month</TableCell><TableCell>{item.prices.length}</TableCell><TableCell>{item.display_order}</TableCell><TableCell><div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(item)}><PencilIcon /><span className="sr-only">Edit</span></Button><form action={duplicatePricingPackageAction}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={item.id} /><Button type="submit" variant="ghost" size="icon-sm"><CopyIcon /><span className="sr-only">Duplicate</span></Button></form>{!item.deleted_at ? <form action={togglePricingPackageAction}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={item.id} /><Button type="submit" variant="ghost" size="icon-sm">{item.is_active ? <EyeOffIcon /> : <EyeIcon />}<span className="sr-only">{item.is_active ? "Deactivate" : "Activate"}</span></Button></form> : null}{!item.deleted_at ? <form action={archivePricingPackageAction}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={item.id} /><Button type="submit" variant="ghost" size="icon-sm"><ArchiveIcon /><span className="sr-only">Archive</span></Button></form> : null}</div></TableCell></TableRow>)}</TableBody></Table> : <Empty className="min-h-64"><EmptyHeader><EmptyMedia variant="icon"><SearchIcon /></EmptyMedia><EmptyTitle>No packages found</EmptyTitle><EmptyDescription>Adjust the filters or create a new pricing package.</EmptyDescription></EmptyHeader></Empty>}</CardContent></Card><PackageEditor key={`${draft.id ?? "new"}-${open}`} locale={locale} currencies={data.currencies} draft={draft} open={open} onOpenChange={setOpen} /></div>;
}

function CurrencyForm({ locale, currency }: { locale: Locale; currency: PricingCurrency }) {
  const router = useRouter();
  const [value, setValue] = useState(currency);
  const [state, action, pending] = useActionState(saveCurrencyAction, initialActionState);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  return <form action={action}><input type="hidden" name="payload" value={JSON.stringify({ ...value, locale })} /><Card><CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle>{value.code}</CardTitle><CardDescription>{value.name}</CardDescription></div><Field orientation="horizontal"><Checkbox id={`currency-active-${value.code}`} checked={value.is_active} onCheckedChange={(checked) => setValue((current) => ({ ...current, is_active: checked === true }))} /><FieldLabel htmlFor={`currency-active-${value.code}`}>Active</FieldLabel></Field></div></CardHeader><CardContent className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-3"><Field><FieldLabel htmlFor={`currency-name-${value.code}`}>Name</FieldLabel><Input id={`currency-name-${value.code}`} value={value.name} onChange={(event) => setValue((current) => ({ ...current, name: event.target.value }))} /></Field><Field><FieldLabel htmlFor={`currency-symbol-${value.code}`}>Symbol</FieldLabel><Input id={`currency-symbol-${value.code}`} value={value.symbol} onChange={(event) => setValue((current) => ({ ...current, symbol: event.target.value }))} /></Field><Field><FieldLabel htmlFor={`currency-order-${value.code}`}>Order</FieldLabel><Input id={`currency-order-${value.code}`} type="number" value={value.display_order} onChange={(event) => setValue((current) => ({ ...current, display_order: Number(event.target.value) }))} /></Field></div>{state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}<Button type="submit" variant="outline" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <SaveIcon />}Save currency</Button></CardContent></Card></form>;
}

function CurrenciesTab({ locale, currencies }: { locale: Locale; currencies: PricingCurrency[] }) {
  const [draft, setDraft] = useState({ code: "", name: "", symbol: "", display_order: 60, is_active: true });
  const [state, action, pending] = useActionState(saveCurrencyAction, initialActionState);
  const router = useRouter();
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  return <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]"><form action={action}><input type="hidden" name="payload" value={JSON.stringify({ ...draft, locale })} /><Card><CardHeader><CardTitle>Add currency</CardTitle><CardDescription>Create a currency once, then set an amount on each package.</CardDescription></CardHeader><CardContent><FieldGroup><Field><FieldLabel htmlFor="new-currency-code">ISO code</FieldLabel><Input id="new-currency-code" maxLength={3} value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="USD" /></Field><Field><FieldLabel htmlFor="new-currency-name">Name</FieldLabel><Input id="new-currency-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></Field><div className="grid grid-cols-2 gap-3"><Field><FieldLabel htmlFor="new-currency-symbol">Symbol</FieldLabel><Input id="new-currency-symbol" value={draft.symbol} onChange={(event) => setDraft((current) => ({ ...current, symbol: event.target.value }))} /></Field><Field><FieldLabel htmlFor="new-currency-order">Order</FieldLabel><Input id="new-currency-order" type="number" value={draft.display_order} onChange={(event) => setDraft((current) => ({ ...current, display_order: Number(event.target.value) }))} /></Field></div>{state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}<Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <PlusIcon />}Add currency</Button></FieldGroup></CardContent></Card></form><div className="grid gap-4 2xl:grid-cols-2">{currencies.map((currency) => <CurrencyForm key={currency.code} locale={locale} currency={currency} />)}</div></div>;
}

function PageContentTab({ locale, content }: { locale: Locale; content: PricingData["content"] }) {
  const router = useRouter();
  const [value, setValue] = useState(content ?? { heading: "", highlighted_heading: "", subtitle: "", intro_text: "", cta_section_title: "", cta_section_description: "", cta_button_label: "", cta_button_url: "/free-trial" });
  const [state, action, pending] = useActionState(savePricingPageContentAction, initialActionState);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  function update(key: keyof typeof value, next: string) { setValue((current) => ({ ...current, [key]: next })); }
  return <form action={action} className="max-w-4xl"><input type="hidden" name="payload" value={JSON.stringify({ ...value, locale })} /><Card><CardHeader><CardTitle>Public pricing page content</CardTitle><CardDescription>These fields update the public heading, introduction, and closing call to action.</CardDescription></CardHeader><CardContent><FieldGroup><div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="page-heading">Main heading</FieldLabel><Input id="page-heading" value={value.heading} onChange={(event) => update("heading", event.target.value)} required /></Field><Field><FieldLabel htmlFor="highlight-heading">Highlighted heading</FieldLabel><Input id="highlight-heading" value={value.highlighted_heading} onChange={(event) => update("highlighted_heading", event.target.value)} required /></Field></div><Field><FieldLabel htmlFor="page-subtitle">Subtitle</FieldLabel><Textarea id="page-subtitle" value={value.subtitle} onChange={(event) => update("subtitle", event.target.value)} required /></Field><Field><FieldLabel htmlFor="intro-text">Introduction</FieldLabel><Textarea id="intro-text" value={value.intro_text} onChange={(event) => update("intro_text", event.target.value)} required /></Field><FieldSet><FieldLegend>Closing call to action</FieldLegend><FieldGroup><Field><FieldLabel htmlFor="cta-title">Title</FieldLabel><Input id="cta-title" value={value.cta_section_title} onChange={(event) => update("cta_section_title", event.target.value)} required /></Field><Field><FieldLabel htmlFor="cta-description">Description</FieldLabel><Textarea id="cta-description" value={value.cta_section_description} onChange={(event) => update("cta_section_description", event.target.value)} required /></Field><div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="page-cta-label">Button label</FieldLabel><Input id="page-cta-label" value={value.cta_button_label} onChange={(event) => update("cta_button_label", event.target.value)} required /></Field><Field><FieldLabel htmlFor="page-cta-url">Button path</FieldLabel><Input id="page-cta-url" value={value.cta_button_url} onChange={(event) => update("cta_button_url", event.target.value)} required /></Field></div></FieldGroup></FieldSet>{state.error ? <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert> : null}{state.success ? <Alert><AlertDescription>Public pricing content saved.</AlertDescription></Alert> : null}<Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <SaveIcon />}{pending ? "Saving…" : "Save page content"}</Button></FieldGroup></CardContent></Card></form>;
}

export function PricingAdmin({ locale, data }: { locale: Locale; data: PricingData }) {
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-sm font-semibold text-primary"><StarIcon className="size-4" />Content management</div><h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Pricing & fee structure</h2><p className="max-w-3xl text-muted-foreground">Manage every public package, feature, currency price, display order, and pricing-page message from one place.</p></div><Tabs defaultValue="packages" className="flex flex-col gap-5"><TabsList variant="line" className="w-full justify-start overflow-x-auto"><TabsTrigger value="packages">Packages</TabsTrigger><TabsTrigger value="currencies">Currencies</TabsTrigger><TabsTrigger value="content">Page content</TabsTrigger></TabsList><TabsContent value="packages"><PackagesTab locale={locale} data={data} /></TabsContent><TabsContent value="currencies"><CurrenciesTab locale={locale} currencies={data.currencies} /></TabsContent><TabsContent value="content"><PageContentTab locale={locale} content={data.content} /></TabsContent></Tabs></main>;
}
