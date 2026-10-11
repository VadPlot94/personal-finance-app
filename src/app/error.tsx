"use client";

import ErrorView from "@/front-end/components/error-view/error-view";
import type { IErrorViewProps } from "@/front-end/components/error-view/types";

export default function RootBoundaryError(props: IErrorViewProps) {
  return <ErrorView {...props} logArea="[error]" />;
}
