import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";

export default function TransactionsTileSkeleton() {
  return (
    <ItemCard className="animate-pulse">
      <TileHeader title="Transactions" href="/transactions" linkLabel="View All" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-3 w-12 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </ItemCard>
  );
}
