export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warnIfAuthEnvMissing } = await import("@/back-end/config/auth-env");
    warnIfAuthEnvMissing();
  }
}
