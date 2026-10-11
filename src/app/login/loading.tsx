import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <ItemCard className="w-full max-w-md">
        <EmptyContentWrapper isLoading />
      </ItemCard>
    </div>
  );
}
