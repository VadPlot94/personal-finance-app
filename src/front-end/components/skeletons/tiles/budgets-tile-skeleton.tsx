import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import constants from "@/shared/services/constants.service";

export default function BudgetsTileSkeleton() {
  return (
    <ItemCard className="animate-pulse">
      <TileHeader
        title="Budgets"
        href={constants.AppRoutes.budgets}
        linkLabel="View All"
      />

      <div className="flex items-center justify-center py-6">
        <div className="h-48 w-48 rounded-full border-[16px] border-gray-200" />
      </div>
    </ItemCard>
  );
}
