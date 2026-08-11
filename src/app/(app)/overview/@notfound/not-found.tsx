import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";

export default function NotFound() {
  return (
    <ItemCard>
      <EmptyContentWrapper
        hasItems={false}
        emptyTitle="404 - Page Not Found"
      ></EmptyContentWrapper>
    </ItemCard>
  );
}
