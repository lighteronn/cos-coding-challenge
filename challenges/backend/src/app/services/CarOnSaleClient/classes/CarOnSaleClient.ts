import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { AuthService } from "./AuthService";
import { IAuctionData } from "../interface/IAuctionData";
const reducer = (accumulator: number, item: number): number => {
  return accumulator + item;
};
@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  private readonly instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      //timeout: 1500,
      baseURL: "https://api-core-dev.caronsale.de/api",
    });
  }
  public async getRunningAuctions(): Promise<any> {
    const authService = new AuthService("salesman@random.com", "123test");
    const userToken = await authService.getUserToken();

    const result = await this.instance
      .get<IAuctionData>("/v2/auction/buyer/", {
        headers: {
          authtoken: userToken.token,
          userid: userToken.userId,
        },
      })
      .catch((err) => {
        throw err;
      });

    const { items, total } = result.data;
    const numBids = items
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
    const averageAuctionProgress = auctionProgress / total;

    return { averageAuctionProgress, total, averageNumBids };
  }
}
