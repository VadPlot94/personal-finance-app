"use client";

import TileErrorView from "@/front-end/components/tile-error-view/tile-error-view";
import type { ITileErrorViewProps } from "@/front-end/components/tile-error-view/types";

export default function TileBoundaryError(props: ITileErrorViewProps) {
  return <TileErrorView {...props} />;
}
