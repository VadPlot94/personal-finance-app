import { notFound } from "next/navigation";
import ItemCard from "@/front-end/components/item-card/item-card";

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
