import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AcademyBrand } from "@/components/brand/academy-brand";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDefaultPortalPath } from "@/server/authorization/permissions";
import { getCurrentUserAccess } from "@/server/authorization/access";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) {
    notFound();
  }

  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    getCurrentUserAccess(),
  ]);

  if (access) {
    const destination = getDefaultPortalPath(access, localeValue);
    if (destination) redirect(destination);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-7">
      <AcademyBrand
        href={`/${localeValue}`}
        name={dictionary.common.brandName}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{dictionary.auth.title}</CardTitle>
          <CardDescription>{dictionary.auth.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm locale={localeValue} dictionary={dictionary} />
        </CardContent>
      </Card>
      <Button variant="ghost" asChild>
        <Link href={`/${localeValue}`}>{dictionary.auth.backHome}</Link>
      </Button>
    </div>
  );
}
