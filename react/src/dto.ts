export type ValuesDto = {
  owner: string;
  spender: string;
  value: bigint;
  nonce: any;
  deadline: number;
};

export type DomainDto = {
  name: string;
  version: string;
  chainId: bigint,
  verifyingContract: string,
};

export type PermitDto = {
  signature: string;
  values: ValuesDto;
  domain: DomainDto;
};

