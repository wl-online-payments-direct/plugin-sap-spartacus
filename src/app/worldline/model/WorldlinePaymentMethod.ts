
export interface WorldlinePaymentMethod {
  id?: string;
  token?:string;
  displayTokenizationForm?:boolean;
  saved?:boolean;
  logo?:string;
  cardBrand?:string;
  accountHolderName?:string;
  alias?:string;
  expiryDate?:string;
}
