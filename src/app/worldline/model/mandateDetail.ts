export interface MandateDetail {
  alias?: string;
  customerReference?: string;
  uniqueMandateReference?: string;
  customer?: MandateCustomer;
}

export interface MandateCustomer {
  iban?: string;
  companyName?: string;
  emailAddress?: string;
  address?: MandateAddress;
  personalInformation?: PersonalInformation;
}

export interface MandateAddress {
  city?: string;
  country?: string;
  street?: string;
  zip?: string;
}

export interface PersonalInformation {
  firstName?: string;
  lastName?: string;
  title?: string;
}
