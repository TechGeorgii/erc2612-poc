export const tokenAddress =
  //"0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"  // stETH Mainnet
  //  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"    // USDC Mainnet
  //  "0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be" // FXS Optimism
  //"0x4200000000000000000000000000000000000042" // OP Optimism
  //"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"  // DAI Optimism
  //"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"  // USDC Optimism
   "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // USDC Polygon
;

// Address of wallet for which approve is given.
export const spenderAddress = "0xAAAAAAA";

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
