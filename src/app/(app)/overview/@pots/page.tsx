import authController from "@/back-end/controllers/auth-controller";
import potController from "@/back-end/controllers/pot-controller";
import PotsTile from "@/front-end/components/pots/pots-tile";

export default async function PotsTilePage() {
  await authController.ensureSession();

  const potsResult = await potController.getAllPots();
  return <PotsTile pots={potsResult.data ?? []} />;
}
