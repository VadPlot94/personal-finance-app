"use client";

import TestThrowErrorButton from "@/front-end/components/test/test-throw-error-button/test-throw-error-button";

export default function TestGlobalErrorButton() {
  return (
    <div className="fixed right-4 bottom-20 z-[100] md:bottom-4">
      <TestThrowErrorButton
        label="Trigger global error"
        onAction={() => {
          throw new Error("Test global error: triggered by admin");
        }}
      />
    </div>
  );
}
