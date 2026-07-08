import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";

export default function PotsTileSkeleton() {
  return (
    <ItemCard className="animate-pulse">
      <TileHeader title="Pots" href="/pots" linkLabel="See details" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 rounded-lg bg-app-background p-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-10 w-1 rounded bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ItemCard>
  );
}
