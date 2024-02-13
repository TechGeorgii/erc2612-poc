export const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Polygon

// Address of wallet for which approve is given.
export const spenderAddress = "0x....";

export const permitTypes = {
  Permit: [
    {
      name: "owner",
      type: "address",
    },
    {
      name: "spender",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
    {
      name: "nonce",
      type: "uint256",
    },
    {
      name: "deadline",
      type: "uint256",
    },
  ],
};
