import "server-only";
import type { Session } from "next-auth";
import { CustomError } from "@/back-end/common/errors";
import cryptoService from "@/back-end/DAL/db-services/crypto.service";
import { userRepository } from "@/back-end/DAL/repositories/user.repository";
import { auth } from "@/lib/auth";

class UserService {
  public async getUser(email: string, password: string) {
    const user = await userRepository.findByEmail(email, {
      id: true,
      email: true,
      name: true,
      hashedPassword: true,
    });

    if (!user?.hashedPassword) {
      return null;
    }

    const isValid = await cryptoService.verifyPassword(
      password,
      user.hashedPassword,
    );
    if (!isValid) {
      return null;
    }

    return user;
  }

  public async findByEmail(email: string) {
    return await userRepository.findByEmail(email, {
      id: true,
      email: true,
      name: true,
    });
  }

  public async createUser(email: string, password: string, name: string) {
    const user = await userRepository.create({
      data: {
        email,
        name,
        hashedPassword: await cryptoService.hashPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  }

  public async createAdminUser(email: string, password: string) {
    return await userRepository.createUser(
      {
        email,
        name: email.split("@")[0] ?? email,
        hashedPassword: await cryptoService.hashPassword(password),
      },
      {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
      },
    );
  }

  public async getAuthenticatedSession(): Promise<Session> {
    const session = await this.getAppSession();

    if (!session?.user?.id) {
      throw new CustomError("Unauthorized");
    }

    return session;
  }

  private async getAppSession() {
    return auth();
  }
}

const userService = new UserService();
export default userService;
