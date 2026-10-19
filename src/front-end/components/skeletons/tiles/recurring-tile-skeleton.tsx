import { getTranslations } from "next-intl/server";
import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import constants from "@/shared/services/constants.service";

export default async function RecurringTileSkeleton() {
  const t = await getTranslations();

  return (
    <ItemCard className="animate-pulse">
      <TileHeader
        title={t("i18n.RecurringPage.Title")}
        href={constants.AppRoutes.recurring}
        linkLabel={t("i18n.Common.SeeDetails")}
      />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
          <div key={index} className="h-12 rounded-lg bg-gray-100" />
        ))}
      </div>
    </ItemCard>
  );
}
