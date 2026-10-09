import { notFound } from "next/navigation";
import ItemCard from "@/front-end/components/item-card/item-card";

// Intentional Overview demo slot: delayed resolve shows @notfound/loading, then notFound() shows @notfound/not-found. Do not remove.
export default async function NotFoundTestPage() {
  const resolvedData = await new Promise((resolve) => {
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
