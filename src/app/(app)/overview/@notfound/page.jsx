import PotsTile from "@/front-end/components/pots/pots-tile";
import { potRepository } from "@/back-end/DAL/repositories/pot.repository";
import authService from "@/back-end/DAL/db-services/auth.service";
import ItemCard from "@/front-end/components/item-card/item-card";
import { notFound } from "next/navigation";

export default async function NotFoundTestPage() {
  const resolvedData = await new Promise((resolve, reject) => {
    setTimeout(async () => {
      resolve(null);
    }, 5000);
  });

  if (!resolvedData) {
    return notFound();
  }

  return (
    <ItemCard>
      <div>Some data available - that is wrong!</div>
    </ItemCard>
  );
}
