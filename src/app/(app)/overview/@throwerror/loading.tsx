import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";

export default function ThrowErrorLoading() {
  return (
    <ItemCard>
      <EmptyContentWrapper isLoading={true} />
    </ItemCard>
  );
}
