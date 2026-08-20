"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  GraduationCapIcon,
  HouseIcon,
  LibraryBigIcon,
  LifeBuoyIcon,
  Link2Icon,
  LockKeyholeIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserRoundCheckIcon,
  WalletCardsIcon,
} from "lucide-react";

import { AcademyBrand } from "@/components/brand/academy-brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOutAction } from "@/features/auth/actions";
import type { Locale, TextDirection } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { PERMISSIONS, type PermissionKey } from "@/config/permissions";
import { hasPermission, type UserAccess } from "@/server/authorization/permissions";

type PortalNavItem = {
  label: string;
  href: string;
  icon: React.ComponentType;
  permission?: PermissionKey;
  available?: boolean;
};

function getPortalBase(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return `/${segments[0] ?? "en"}/${segments[1] ?? "student"}`;
}

function getRoleLabel(access: UserAccess, dictionary: Dictionary): string {
  if (hasPermission(access, PERMISSIONS.PORTAL_ADMIN_VIEW)) return dictionary.portal.superAdmin;
  if (hasPermission(access, PERMISSIONS.PORTAL_STAFF_VIEW)) return dictionary.portal.staff;
  if (hasPermission(access, PERMISSIONS.PORTAL_TEACHER_VIEW)) return dictionary.portal.teacher;
  if (hasPermission(access, PERMISSIONS.PORTAL_PARENT_VIEW)) return dictionary.portal.parent;
  return dictionary.portal.student;
}

function getPortalTitle(pathname: string, dictionary: Dictionary): string {
  if (pathname.includes("/admin/pricing")) return dictionary.portal.nav.pricing;
  if (pathname.endsWith("/profile")) return dictionary.portal.phase2.profileTitle;
  if (pathname.includes("/parent-links")) return dictionary.portal.phase2.parentLinkReviews;
  if (pathname.includes("/teachers")) return dictionary.portal.phase2.teacherApplicationReviews;
  if (pathname.includes("/admin/staff")) return dictionary.portal.phase2.staffDirectory;
  if (pathname.includes("/admin/people")) return dictionary.portal.phase2.adminPeopleTitle;
  if (pathname.includes("/admin")) return dictionary.portal.academyOverview;
  if (pathname.includes("/staff")) return dictionary.portal.staffOverview;
  if (pathname.includes("/teacher")) return dictionary.portal.teacherOverview;
  if (pathname.includes("/parent")) return dictionary.portal.parentOverview;
  return dictionary.portal.studentOverview;
}

function getNavItems(
  basePath: string,
  access: UserAccess,
  dictionary: Dictionary
): PortalNavItem[] {
  const overview: PortalNavItem = {
    label: dictionary.portal.nav.overview,
    href: `${basePath}/dashboard`,
    icon: HouseIcon,
    available: true,
  };

  if (hasPermission(access, PERMISSIONS.PORTAL_ADMIN_VIEW)) {
    return [
      overview,
      { label: dictionary.portal.nav.people, href: `${basePath}/people`, icon: UsersIcon, permission: PERMISSIONS.USERS_READ, available: true },
      { label: dictionary.portal.nav.parentLinks, href: `${basePath}/parent-links`, icon: Link2Icon, permission: PERMISSIONS.PARENT_LINKS_REVIEW, available: true },
      { label: dictionary.portal.nav.teacherReviews, href: `${basePath}/teachers`, icon: UserRoundCheckIcon, permission: PERMISSIONS.TEACHER_APPLICATIONS_REVIEW, available: true },
      { label: dictionary.portal.nav.staffDirectory, href: `${basePath}/staff`, icon: UsersIcon, permission: PERMISSIONS.STAFF_MANAGE, available: true },
      { label: dictionary.portal.nav.requests, href: `${basePath}/requests`, icon: ClipboardCheckIcon, permission: PERMISSIONS.ADMISSIONS_READ, available: true },
      { label: dictionary.portal.nav.pricing, href: `${basePath}/pricing`, icon: CircleDollarSignIcon, permission: PERMISSIONS.CONTENT_MANAGE, available: true },
      { label: dictionary.portal.nav.academics, href: basePath, icon: BookOpenIcon, permission: PERMISSIONS.COURSES_READ },
      { label: dictionary.portal.nav.operations, href: basePath, icon: CalendarDaysIcon, permission: PERMISSIONS.SCHEDULING_READ },
      { label: dictionary.portal.nav.finance, href: basePath, icon: CircleDollarSignIcon, permission: PERMISSIONS.FINANCE_READ },
      { label: dictionary.portal.nav.content, href: basePath, icon: FileTextIcon, permission: PERMISSIONS.CONTENT_READ },
      { label: dictionary.portal.nav.security, href: basePath, icon: ShieldCheckIcon, permission: PERMISSIONS.SECURITY_READ },
      { label: dictionary.portal.nav.settings, href: basePath, icon: SettingsIcon, permission: PERMISSIONS.SETTINGS_MANAGE },
    ];
  }

  if (hasPermission(access, PERMISSIONS.PORTAL_STAFF_VIEW)) {
    return [
      overview,
      { label: dictionary.portal.nav.profile, href: `${basePath}/profile`, icon: UsersIcon, permission: PERMISSIONS.PROFILE_UPDATE_OWN, available: true },
      {
        label: dictionary.portal.nav.people,
        href: basePath,
        icon: UsersIcon,
        permission: PERMISSIONS.USERS_READ,
      },
      {
        label: dictionary.portal.nav.academics,
        href: basePath,
        icon: BookOpenIcon,
        permission: PERMISSIONS.COURSES_READ,
      },
      {
        label: dictionary.portal.nav.operations,
        href: basePath,
        icon: CalendarDaysIcon,
        permission: PERMISSIONS.SCHEDULING_READ,
      },
      {
        label: dictionary.portal.nav.finance,
        href: basePath,
        icon: CircleDollarSignIcon,
        permission: PERMISSIONS.FINANCE_READ,
      },
      {
        label: dictionary.portal.nav.content,
        href: basePath,
        icon: FileTextIcon,
        permission: PERMISSIONS.CONTENT_READ,
      },
      {
        label: dictionary.portal.nav.security,
        href: basePath,
        icon: ShieldCheckIcon,
        permission: PERMISSIONS.SECURITY_READ,
      },
    ];
  }

  if (hasPermission(access, PERMISSIONS.PORTAL_TEACHER_VIEW)) {
    return [
      overview,
      { label: dictionary.portal.nav.profile, href: `${basePath}/profile`, icon: UsersIcon, permission: PERMISSIONS.PROFILE_UPDATE_OWN, available: true },
      { label: dictionary.portal.nav.schedule, href: basePath, icon: CalendarDaysIcon },
      { label: dictionary.portal.nav.people, href: basePath, icon: UsersIcon },
      { label: dictionary.portal.nav.homework, href: basePath, icon: ClipboardCheckIcon },
      { label: dictionary.portal.nav.progress, href: basePath, icon: GraduationCapIcon },
      { label: dictionary.portal.nav.earnings, href: basePath, icon: WalletCardsIcon },
    ];
  }

  if (hasPermission(access, PERMISSIONS.PORTAL_PARENT_VIEW)) {
    return [
      overview,
      { label: dictionary.portal.nav.profile, href: `${basePath}/profile`, icon: UsersIcon, permission: PERMISSIONS.PROFILE_UPDATE_OWN, available: true },
      { label: dictionary.portal.nav.children, href: basePath, icon: UsersIcon },
      { label: dictionary.portal.nav.schedule, href: basePath, icon: CalendarDaysIcon },
      { label: dictionary.portal.nav.attendance, href: basePath, icon: ClipboardCheckIcon },
      { label: dictionary.portal.nav.progress, href: basePath, icon: GraduationCapIcon },
      { label: dictionary.portal.nav.finance, href: basePath, icon: WalletCardsIcon },
    ];
  }

  return [
    overview,
    { label: dictionary.portal.nav.profile, href: `${basePath}/profile`, icon: UsersIcon, permission: PERMISSIONS.PROFILE_UPDATE_OWN, available: true },
    { label: dictionary.portal.nav.schedule, href: basePath, icon: CalendarDaysIcon },
    { label: dictionary.portal.nav.courses, href: basePath, icon: LibraryBigIcon },
    { label: dictionary.portal.nav.attendance, href: basePath, icon: ClipboardCheckIcon },
    { label: dictionary.portal.nav.homework, href: basePath, icon: BookOpenIcon },
    { label: dictionary.portal.nav.progress, href: basePath, icon: GraduationCapIcon },
  ];
}

export function PortalShell({
  children,
  access,
  locale,
  direction,
  dateLabel,
  dictionary,
}: {
  children: React.ReactNode;
  access: UserAccess;
  locale: Locale;
  direction: TextDirection;
  dateLabel: string;
  dictionary: Dictionary;
}) {
  const pathname = usePathname();
  const basePath = getPortalBase(pathname);
  const navItems = getNavItems(basePath, access, dictionary);
  const roleLabel = getRoleLabel(access, dictionary);
  const displayName = access.displayName ?? access.email ?? roleLabel;
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const boundSignOut = signOutAction.bind(null, locale);

  return (
    <SidebarProvider>
      <Sidebar side={direction === "rtl" ? "right" : "left"} collapsible="icon">
        <SidebarHeader className="p-4">
          <AcademyBrand
            href={`/${locale}`}
            name={dictionary.common.brandName}
            inverse
            compact
          />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{dictionary.portal.navigationLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const permitted = item.permission
                    ? hasPermission(access, item.permission)
                    : true;
                  const available = item.available ?? false;

                  return (
                    <SidebarMenuItem key={`${item.label}-${index}`}>
                      {available && permitted ? (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.label}
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          disabled
                          tooltip={`${item.label}: ${dictionary.portal.modulePlanned}`}
                        >
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={dictionary.portal.goToWebsite}>
                <Link href={`/${locale}`}>
                  <LifeBuoyIcon />
                  <span>{dictionary.portal.goToWebsite}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex min-h-18 items-center gap-4 border-b px-4 sm:px-6">
          <SidebarTrigger />
          <div className="min-w-0">
            <h1 className="truncate font-heading text-2xl font-semibold">
              {getPortalTitle(pathname, dictionary)}
            </h1>
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
          </div>
          <div className="ms-auto hidden max-w-sm flex-1 md:block">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label={dictionary.portal.search}
                placeholder={dictionary.portal.search}
                className="ps-9"
                disabled
              />
            </div>
          </div>
          <Button variant="outline" size="icon" disabled>
            <BellIcon />
            <span className="sr-only">{dictionary.portal.notifications}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-auto gap-2 px-2 py-1">
                <Avatar size="sm">
                  <AvatarFallback>{initials || "SA"}</AvatarFallback>
                </Avatar>
                <span className="hidden text-start sm:block">
                  <span className="block max-w-36 truncate text-sm">{displayName}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{roleLabel}</span>
                </span>
                <span className="sr-only">{dictionary.portal.accountMenu}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <form action={boundSignOut}>
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full">
                      <LockKeyholeIcon />
                      {dictionary.common.signOut}
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
