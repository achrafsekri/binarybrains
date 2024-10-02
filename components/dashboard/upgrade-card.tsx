import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Déverrouiller Pro</CardTitle>
        <CardDescription>
          Accédez à des fonctionnalités avancées et des options de
          personnalisation
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Button size="sm" className="w-full">
          <Link href="/pricing">Voir les plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
