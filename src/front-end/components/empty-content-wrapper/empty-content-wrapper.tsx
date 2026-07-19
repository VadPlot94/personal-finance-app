import LoadingIndicator from "@/front-end/components/loading-indicator/loading-indicator";
import { IEmptyContentWrapperProps } from "./types";

export default function EmptyContentWrapper({
  hasItems,
  isLoading = false,
  children,
  emptyTitle,
  emptyBody,
}: IEmptyContentWrapperProps) {
  const wrapperClassName =
    "flex flex-col w-full min-h-25 h-full justify-center items-center text-app-color text-center gap-3";

  if (isLoading) {
    return (
      <div className={wrapperClassName}>
        <LoadingIndicator fullScreen={false} className="h-8 w-8" />
        <p className="font-semibold">Loading...</p>
      </div>
    );
  }

  if (hasItems) {
    return <>{children}</>;
  }

  return (
    <div className={wrapperClassName}>
      <p className="font-semibold">{emptyTitle}</p>
      {emptyBody && <p>{emptyBody}</p>}
    </div>
  );
}
