import { connection } from "next/server";

// Intentional Overview demo slot: delayed resolve shows @throwerror/loading, then throw
// is caught by @throwerror/error.tsx. Do not remove.
export default async function ThrowErrorPage() {
  await connection();
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  throw new Error("Test error: throw-error demo");
}
