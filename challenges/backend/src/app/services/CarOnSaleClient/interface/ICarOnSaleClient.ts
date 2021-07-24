/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
import { IRunningAuctions } from "./IAuctionData";
import { IAuthService } from "./IAuthService";
export interface ICarOnSaleClient {
  getRunningAuctions(token: string, userId: string): Promise<IRunningAuctions>;
  authService(userMailId: string, password: string): Promise<IAuthService>;
}
