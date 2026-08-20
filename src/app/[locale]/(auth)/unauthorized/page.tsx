import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { AcademyBrand } from "@/components/brand/academy-brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultPortalPath } from "@/server/authorization/permissions";
import { getCurrentUserAccess } from "@/server/authorization/access";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function UnauthorizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) notFound();

  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    getCurrentUserAccess(),
  ]);
  const destination = access
    ? getDefaultPortalPath(access, localeValue)
    : `/${localeValue}/login`;

  return (
    <div className="flex w-full max-w-lg flex-col gap-7">
      <AcademyBrand href={`/${localeValue}`} name={dictionary.common.brandName} />
      <Card>
        <CardHeader>
          <ShieldAlertIcon aria-hidden="true" className="text-primary" />
          <CardTitle className="text-3xl">{dictionary.portal.unauthorizedTitle}</CardTitle>
          <CardDescription>{dictionary.portal.unauthorizedDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={destination ?? `/${localeValue}`}>
              {dictionary.portal.returnToPortal}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
