export interface IRunningAuctions {
  items: IAuction[];
  total: number;
}

export interface IAuction {
  currentHighestBidValue: number;
  numBids: number;
  minimumRequiredAsk: number;
}
