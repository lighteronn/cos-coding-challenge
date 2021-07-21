import  {ICarOnSaleClient} from "./ICarOnSaleClient";
import { injectable, inject } from "inversify";
import "reflect-metadata";


@injectable()
export class AuctionService implements ICarOnSaleClient {
    
}