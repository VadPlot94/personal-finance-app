"use client";

import { useEffect, useState } from "react";
import { isAdminSessionSRF } from "@/back-end/server-actions/auth-actions";
import type { ITestThrowErrorButtonProps } from "@/front-end/components/test/test-throw-error-button/types";

export default function TestThrowErrorButton({
  label,
  onAction,
}: ITestThrowErrorButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shouldRunAction, setShouldRunAction] = useState(false);

  // Server Actions cannot run during Client Component initial render (prerender/build
  // fails with "Server Functions cannot be called during initial render"). use() +
  // useState(() => action()) hits that path; call the action after mount instead.
  useEffect(() => {
    void isAdminSessionSRF().then(setIsAdmin);
  }, []);

  if (shouldRunAction) {
    onAction();
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setShouldRunAction(true)}
      className="inline-flex h-9 items-center justify-center rounded-md border border-destructive/40 bg-white px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {label}
    </button>
  );
}
