import { getTranslations } from "next-intl/server";
import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import constants from "@/shared/services/constants.service";

export default async function BudgetsTileSkeleton() {
  const t = await getTranslations();

  return (
    <ItemCard className="animate-pulse">
      <TileHeader
        title={t("i18n.BudgetsPage.Title")}
        href={constants.AppRoutes.budgets}
        linkLabel={t("i18n.Common.ViewAll")}
      />

      <div className="flex items-center justify-center py-6">
        <div className="h-48 w-48 rounded-full border-[16px] border-gray-200" />
      </div>
    </ItemCard>
  );
}
