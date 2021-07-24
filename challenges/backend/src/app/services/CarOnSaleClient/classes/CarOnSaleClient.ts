import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { IRunningAuctions } from "../interface/IAuctionData";
import { IAuthService } from "../interface/IAuthService";
/*const reducer = (accumulator: number, item: number): number => {
  return accumulator + item;
};*/
@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  private readonly instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      timeout: 1500,
      baseURL: "https://api-core-dev.caronsale.de/api",
    });
  }
  public async authService(userMailId: string, password: string): Promise<IAuthService> {
    const result = await this.instance
      .put(`/v1/authentication/${userMailId}`, { password })
      .catch((err) => {
        throw err;
      });

    return result.data;
  }
  public async getRunningAuctions(token: string, userId: string): Promise<IRunningAuctions> {
    const result = await this.instance
      .get<IRunningAuctions>("/v2/auction/buyer/", {
        headers: {
          authtoken: token,
          userid: userId,
        },
      })
      .catch((err) => {
        throw err;
      });

    const { items, total } = result.data;
    /*const numBids = items
      .map((item: { numBids: number }) => item.numBids)
      .reduce(reducer, 0);
    const averageNumBids = numBids / total;
    const auctionProgress = items
      .map(
        (item: {
          currentHighestBidValue: number;
          minimumRequiredAsk: number;
        }) => item.currentHighestBidValue / item.minimumRequiredAsk
      )
      .reduce(reducer, 0);
    const averageAuctionProgress = auctionProgress / total*/

    return { items, total, };
  }
}
