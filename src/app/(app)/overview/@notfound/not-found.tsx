import { getTranslations } from "next-intl/server";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <ItemCard>
      <EmptyContentWrapper
        hasItems={false}
        emptyTitle={t("i18n.Errors.NotFound")}
      ></EmptyContentWrapper>
    </ItemCard>
  );
}
