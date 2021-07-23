import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);
    try {
      const { total, averageAuctionProgress, averageNumBids } =
        await this.carOnSaleClient.getRunningAuctions();
      this.logger.log(`Total number of auctions: ${total}`);
      this.logger.log(`Percentage of average auction progress: ${averageAuctionProgress * 100}`);
      this.logger.log(`Average number of bids: ${averageNumBids}`);
      process.exit(0);
    } catch (error) {
      this.logger.log(error);
      process.exit(-1);
    }
    // TODO: Retrieve auctions and display aggregated information (see README.md)
  }
}
