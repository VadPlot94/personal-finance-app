import { Pot } from "@prisma/client";

class PotService {
  public getAllSavedPotsMoney(pots: Pot[]) {
    return pots?.reduce((acc, val) => acc + val.total, 0) || 0;
  }
}

const potService = new PotService();
export default potService;
