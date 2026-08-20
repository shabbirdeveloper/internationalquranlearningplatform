import { ConstructionIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { Dictionary } from "@/i18n/types";

export function PortalPlaceholder({
  title,
  dictionary,
}: {
  title: string;
  dictionary: Dictionary;
}) {
  return (
    <main id="main-content" className="flex flex-1 p-4 sm:p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription>{dictionary.portal.placeholderDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="min-h-[28rem] border">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ConstructionIcon /></EmptyMedia>
              <EmptyTitle>{dictionary.portal.placeholderTitle}</EmptyTitle>
              <EmptyDescription>{dictionary.portal.placeholderDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </main>
  );
}
