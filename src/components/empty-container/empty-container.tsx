import { IEmptyContainerProps } from "../types";

export default function EmptyContainer({
  hasItems,
  children,
  emptyTitle,
  emptyBody,
}: IEmptyContainerProps) {
  if (hasItems) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col w-full min-h-25 h-full justify-center items-center text-app-color text-center gap-3">
      <p className="font-semibold">{emptyTitle}</p>
      {emptyBody && <p>{emptyBody}</p>}
    </div>
  );
}
