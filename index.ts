import { Wallet, ethers } from "ethers";
import { config } from "dotenv";

async function main() {
  config();

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  //const wallet = new Wallet(process.env.PK!, provider);

  const abi = [
    "function decimals() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address addr) view returns (uint)",
  ];

  const usdtContract = new ethers.Contract(
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon mainnet
    abi,
    provider
  );

  const bal = await usdtContract.balanceOf("0x....");

  console.log(bal);
}

main().catch((error) => {
  console.error("Error:", error);
});
