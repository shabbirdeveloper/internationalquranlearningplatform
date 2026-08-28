"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveIcon, EyeIcon, EyeOffIcon, ImagesIcon, NewspaperIcon, PencilIcon, PlusIcon, SaveIcon, SearchIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { archiveBlogPostAction, archiveGalleryItemAction, saveBlogPostAction, saveGalleryItemAction, toggleBlogPostAction, toggleGalleryItemAction, type ContentLibraryActionState } from "@/features/content-library/actions";
import type { Locale } from "@/i18n/config";
import type { BlogPost, GalleryItem } from "@/server/repositories/content-library-repository";

const initialState: ContentLibraryActionState = {};

type BlogDraft = Pick<BlogPost, "locale" | "slug" | "title" | "excerpt" | "body" | "category" | "cover_image_url" | "cover_image_alt" | "author_name" | "reading_time_minutes" | "is_featured" | "is_published" | "display_order"> & { id: string | null };
type GalleryDraft = Pick<GalleryItem, "locale" | "title" | "caption" | "category" | "image_url" | "image_alt" | "is_featured" | "is_published" | "display_order"> & { id: string | null };

function newBlog(): BlogDraft { return { id: null, locale: "en", slug: "", title: "", excerpt: "", body: "", category: "Quran studies", cover_image_url: "/images/shia-taleem-hero-learning.png", cover_image_alt: "", author_name: "SHIA TALEEM Academic Team", reading_time_minutes: 4, is_featured: false, is_published: false, display_order: 10 }; }
function newGallery(): GalleryDraft { return { id: null, locale: "en", title: "", caption: "", category: "Live lessons", image_url: "/images/shia-taleem-hero-learning.png", image_alt: "", is_featured: false, is_published: false, display_order: 10 }; }

function ContentHeading({ kind, onCreate }: { kind: "blog" | "gallery"; onCreate: () => void }) {
  const blog = kind === "blog";
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold text-primary">{blog ? <NewspaperIcon className="size-4" /> : <ImagesIcon className="size-4" />}Content management</div><h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{blog ? "Blog library" : "Gallery library"}</h2><p className="mt-2 max-w-3xl text-muted-foreground">{blog ? "Create, edit, publish, reorder, and archive public academy articles." : "Manage the images, captions, categories, order, and visibility of the public gallery."}</p></div><Button onClick={onCreate}><PlusIcon />{blog ? "New blog post" : "New gallery item"}</Button></div>;
}

function StatusBadge({ published, deleted }: { published: boolean; deleted: string | null }) {
  return <Badge variant={deleted ? "outline" : published ? "default" : "secondary"}>{deleted ? "Archived" : published ? "Published" : "Draft"}</Badge>;
}

function CommandButtons({ locale, id, published, deleted, onEdit, kind }: { locale: Locale; id: string; published: boolean; deleted: string | null; onEdit: () => void; kind: "blog" | "gallery" }) {
  const toggle = kind === "blog" ? toggleBlogPostAction : toggleGalleryItemAction;
  const archive = kind === "blog" ? archiveBlogPostAction : archiveGalleryItemAction;
  return <div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon-sm" onClick={onEdit}><PencilIcon /><span className="sr-only">Edit</span></Button>{!deleted ? <form action={toggle}><input type="hidden" name="portalLocale" value={locale} /><input type="hidden" name="id" value={id} /><Button type="submit" variant="ghost" size="icon-sm">{published ? <EyeOffIcon /> : <EyeIcon />}<span className="sr-only">{published ? "Unpublish" : "Publish"}</span></Button></form> : null}{!deleted ? <form action={archive}><input type="hidden" name="portalLocale" value={locale} /><input type="hidden" name="id" value={id} /><Button type="submit" variant="ghost" size="icon-sm"><ArchiveIcon /><span className="sr-only">Archive</span></Button></form> : null}</div>;
}

function EditorShell({ open, onOpenChange, title, description, pending, children, error }: { open: boolean; onOpenChange: (value: boolean) => void; title: string; description: string; pending: boolean; children: React.ReactNode; error?: string }) {
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent className="w-full overflow-y-auto sm:max-w-2xl"><SheetHeader className="border-b"><SheetTitle className="text-xl">{title}</SheetTitle><SheetDescription>{description}</SheetDescription></SheetHeader><div className="px-4 pb-4">{error ? <Alert variant="destructive" className="mb-5"><AlertDescription>{error}</AlertDescription></Alert> : null}{children}</div><SheetFooter className="sticky bottom-0 border-t bg-popover"><Button type="submit" form="content-editor" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <SaveIcon />}{pending ? "Saving…" : "Save content"}</Button></SheetFooter></SheetContent></Sheet>;
}

function BlogEditor({ portalLocale, draft, open, onOpenChange }: { portalLocale: Locale; draft: BlogDraft; open: boolean; onOpenChange: (value: boolean) => void }) {
  const [value, setValue] = useState(draft); const router = useRouter();
  const [state, action, pending] = useActionState(saveBlogPostAction, initialState);
  useEffect(() => { if (state.success) { onOpenChange(false); router.refresh(); } }, [onOpenChange, router, state.success]);
  function update<K extends keyof BlogDraft>(key: K, next: BlogDraft[K]) { setValue((current) => ({ ...current, [key]: next })); }
  return <EditorShell open={open} onOpenChange={onOpenChange} title={value.id ? "Edit blog post" : "Create blog post"} description="Write the full article and control how it appears on the public journal." pending={pending} error={state.error}><form id="content-editor" action={action}><input type="hidden" name="payload" value={JSON.stringify({ ...value, portalLocale })} /><FieldGroup>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="blog-locale">Content language</FieldLabel><Select value={value.locale} onValueChange={(next) => update("locale", next as Locale)}><SelectTrigger id="blog-locale"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ur">Urdu</SelectItem><SelectItem value="ar">Arabic</SelectItem><SelectItem value="fa">Farsi</SelectItem></SelectContent></Select></Field><Field><FieldLabel htmlFor="blog-order">Display order</FieldLabel><Input id="blog-order" type="number" min={0} value={value.display_order} onChange={(event) => update("display_order", Number(event.target.value))} /></Field></div>
    <Field><FieldLabel htmlFor="blog-title">Title</FieldLabel><Input id="blog-title" value={value.title} onChange={(event) => update("title", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="blog-slug">URL slug</FieldLabel><Input id="blog-slug" value={value.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))} required /><FieldDescription>Example: building-a-quran-routine</FieldDescription></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="blog-category">Category</FieldLabel><Input id="blog-category" value={value.category} onChange={(event) => update("category", event.target.value)} required /></Field><Field><FieldLabel htmlFor="blog-author">Author</FieldLabel><Input id="blog-author" value={value.author_name} onChange={(event) => update("author_name", event.target.value)} required /></Field></div>
    <Field><FieldLabel htmlFor="blog-excerpt">Short summary</FieldLabel><Textarea id="blog-excerpt" rows={3} value={value.excerpt} onChange={(event) => update("excerpt", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="blog-body">Article content</FieldLabel><Textarea id="blog-body" rows={12} value={value.body} onChange={(event) => update("body", event.target.value)} required /><FieldDescription>Separate paragraphs with a blank line.</FieldDescription></Field>
    <Field><FieldLabel htmlFor="blog-image">Cover image path or URL</FieldLabel><Input id="blog-image" value={value.cover_image_url} onChange={(event) => update("cover_image_url", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="blog-alt">Image description</FieldLabel><Input id="blog-alt" value={value.cover_image_alt} onChange={(event) => update("cover_image_alt", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="blog-reading">Reading time (minutes)</FieldLabel><Input id="blog-reading" type="number" min={1} value={value.reading_time_minutes} onChange={(event) => update("reading_time_minutes", Number(event.target.value))} /></Field>
    <div className="grid gap-3 sm:grid-cols-2"><Field orientation="horizontal"><Checkbox id="blog-featured" checked={value.is_featured} onCheckedChange={(checked) => update("is_featured", checked === true)} /><FieldLabel htmlFor="blog-featured">Featured story</FieldLabel></Field><Field orientation="horizontal"><Checkbox id="blog-published" checked={value.is_published} onCheckedChange={(checked) => update("is_published", checked === true)} /><FieldLabel htmlFor="blog-published">Publish now</FieldLabel></Field></div>
  </FieldGroup></form></EditorShell>;
}

function GalleryEditor({ portalLocale, draft, open, onOpenChange }: { portalLocale: Locale; draft: GalleryDraft; open: boolean; onOpenChange: (value: boolean) => void }) {
  const [value, setValue] = useState(draft); const router = useRouter();
  const [state, action, pending] = useActionState(saveGalleryItemAction, initialState);
  useEffect(() => { if (state.success) { onOpenChange(false); router.refresh(); } }, [onOpenChange, router, state.success]);
  function update<K extends keyof GalleryDraft>(key: K, next: GalleryDraft[K]) { setValue((current) => ({ ...current, [key]: next })); }
  return <EditorShell open={open} onOpenChange={onOpenChange} title={value.id ? "Edit gallery item" : "Add gallery item"} description="Add an image, an accessible description, and the story behind the moment." pending={pending} error={state.error}><form id="content-editor" action={action}><input type="hidden" name="payload" value={JSON.stringify({ ...value, portalLocale })} /><FieldGroup>
    <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="gallery-locale">Content language</FieldLabel><Select value={value.locale} onValueChange={(next) => update("locale", next as Locale)}><SelectTrigger id="gallery-locale"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ur">Urdu</SelectItem><SelectItem value="ar">Arabic</SelectItem><SelectItem value="fa">Farsi</SelectItem></SelectContent></Select></Field><Field><FieldLabel htmlFor="gallery-order">Display order</FieldLabel><Input id="gallery-order" type="number" min={0} value={value.display_order} onChange={(event) => update("display_order", Number(event.target.value))} /></Field></div>
    <Field><FieldLabel htmlFor="gallery-title">Title</FieldLabel><Input id="gallery-title" value={value.title} onChange={(event) => update("title", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="gallery-caption">Caption</FieldLabel><Textarea id="gallery-caption" rows={4} value={value.caption} onChange={(event) => update("caption", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="gallery-category">Category</FieldLabel><Input id="gallery-category" value={value.category} onChange={(event) => update("category", event.target.value)} required /></Field>
    <Field><FieldLabel htmlFor="gallery-image">Image path or URL</FieldLabel><Input id="gallery-image" value={value.image_url} onChange={(event) => update("image_url", event.target.value)} required /><FieldDescription>Use an uploaded path such as /images/photo.jpg or a secure image URL.</FieldDescription></Field>
    <Field><FieldLabel htmlFor="gallery-alt">Image description</FieldLabel><Input id="gallery-alt" value={value.image_alt} onChange={(event) => update("image_alt", event.target.value)} required /></Field>
    <div className="grid gap-3 sm:grid-cols-2"><Field orientation="horizontal"><Checkbox id="gallery-featured" checked={value.is_featured} onCheckedChange={(checked) => update("is_featured", checked === true)} /><FieldLabel htmlFor="gallery-featured">Featured image</FieldLabel></Field><Field orientation="horizontal"><Checkbox id="gallery-published" checked={value.is_published} onCheckedChange={(checked) => update("is_published", checked === true)} /><FieldLabel htmlFor="gallery-published">Publish now</FieldLabel></Field></div>
  </FieldGroup></form></EditorShell>;
}

export function BlogAdmin({ locale, posts }: { locale: Locale; posts: BlogPost[] }) {
  const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [draft, setDraft] = useState<BlogDraft>(newBlog);
  const filtered = useMemo(() => posts.filter((post) => `${post.title} ${post.category} ${post.slug}`.toLowerCase().includes(query.toLowerCase())), [posts, query]);
  function create() { setDraft(newBlog()); setOpen(true); } function edit(post: BlogPost) { setDraft({ ...post, id: post.id }); setOpen(true); }
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><ContentHeading kind="blog" onCreate={create} /><div className="relative max-w-xl"><SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blog posts" className="ps-9" /></div><Card><CardContent className="overflow-x-auto p-0"><Table><TableHeader><TableRow><TableHead>Post</TableHead><TableHead>Language</TableHead><TableHead>Status</TableHead><TableHead>Order</TableHead><TableHead className="text-end">Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map((post) => <TableRow key={post.id}><TableCell><p className="font-semibold">{post.title}</p><p className="text-xs text-muted-foreground">{post.category} · {post.slug}</p></TableCell><TableCell className="uppercase">{post.locale}</TableCell><TableCell><StatusBadge published={post.is_published} deleted={post.deleted_at} /></TableCell><TableCell>{post.display_order}</TableCell><TableCell><CommandButtons locale={locale} id={post.id} published={post.is_published} deleted={post.deleted_at} onEdit={() => edit(post)} kind="blog" /></TableCell></TableRow>)}{!filtered.length ? <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground">No blog posts found. Create your first story.</TableCell></TableRow> : null}</TableBody></Table></CardContent></Card><BlogEditor key={`${draft.id ?? "new"}-${open}`} portalLocale={locale} draft={draft} open={open} onOpenChange={setOpen} /></main>;
}

export function GalleryAdmin({ locale, items }: { locale: Locale; items: GalleryItem[] }) {
  const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [draft, setDraft] = useState<GalleryDraft>(newGallery);
  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  function create() { setDraft(newGallery()); setOpen(true); } function edit(item: GalleryItem) { setDraft({ ...item, id: item.id }); setOpen(true); }
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><ContentHeading kind="gallery" onCreate={create} /><div className="relative max-w-xl"><SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gallery items" className="ps-9" /></div><Card><CardContent className="overflow-x-auto p-0"><Table><TableHeader><TableRow><TableHead>Gallery item</TableHead><TableHead>Language</TableHead><TableHead>Status</TableHead><TableHead>Order</TableHead><TableHead className="text-end">Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id}><TableCell><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.category} · {item.image_url}</p></TableCell><TableCell className="uppercase">{item.locale}</TableCell><TableCell><StatusBadge published={item.is_published} deleted={item.deleted_at} /></TableCell><TableCell>{item.display_order}</TableCell><TableCell><CommandButtons locale={locale} id={item.id} published={item.is_published} deleted={item.deleted_at} onEdit={() => edit(item)} kind="gallery" /></TableCell></TableRow>)}{!filtered.length ? <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground">No gallery items found. Add your first image.</TableCell></TableRow> : null}</TableBody></Table></CardContent></Card><GalleryEditor key={`${draft.id ?? "new"}-${open}`} portalLocale={locale} draft={draft} open={open} onOpenChange={setOpen} /></main>;
}
