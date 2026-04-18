import bcrypt from "bcryptjs";

class CryptoService {
  public async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  public async verifyPassword(password: string, storedHash: string) {
    return bcrypt.compare(password, storedHash);
  }
}

const cryptoService = new CryptoService();
export default cryptoService;
