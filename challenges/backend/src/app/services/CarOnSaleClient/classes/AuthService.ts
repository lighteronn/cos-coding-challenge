import { IAuthService } from "../interface/IAuthService";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class AuthService implements IAuthService {
  private readonly instance: AxiosInstance;
  private readonly userMailId: string;
  private readonly password: string;

  constructor(userMailId: string, password: string) {
    this.instance = axios.create({
      timeout: 1500,
      baseURL: "https://api-core-dev.caronsale.de/api",
    });
    this.userMailId = userMailId;
    this.password = password;
  }
  public async getUserToken(): Promise<any> {
    const result: AxiosResponse = await this.instance
      .put(`/v1/authentication/${this.userMailId}`, { password: this.password })
      .catch((err) => {
        throw err;
      });

    return result.data;
  }
}
