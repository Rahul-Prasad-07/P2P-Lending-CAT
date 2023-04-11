export class AskRequest {
  requestContractAddress: string;
  collateralBalance: number;
  asker: string;
  lender: string;
  askAmount: number;
  paybackAmount: number;
  purpose: string;
  moneyLent: boolean;
  debtSettled: boolean;
  collateralCollected: boolean;
  collateral: number;
  collateralCollectionTimeStamp: number;
  currentTimeStamp: number;
}
