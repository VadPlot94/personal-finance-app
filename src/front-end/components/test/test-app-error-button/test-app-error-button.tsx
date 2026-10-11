"use client";

import TestThrowErrorButton from "@/front-end/components/test/test-throw-error-button/test-throw-error-button";

export default function TestAppErrorButton() {
  return (
    <TestThrowErrorButton
      label="Trigger error"
      onAction={() => {
        throw new Error("Test error: triggered by admin");
      }}
    />
  );
}
