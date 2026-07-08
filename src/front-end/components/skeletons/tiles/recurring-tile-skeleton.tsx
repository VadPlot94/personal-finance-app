import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";

export default function RecurringTileSkeleton() {
  return (
    <ItemCard className="animate-pulse">
      <TileHeader title="Recurring Bills" href="/recurring" linkLabel="See details" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-12 rounded-lg bg-gray-100" />
        ))}
      </div>
    </ItemCard>
  );
}
