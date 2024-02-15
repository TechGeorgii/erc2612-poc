import { Wallet, ethers } from "ethers";
import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import * as constants from "../react/src/constants";
import * as dto from "../react/src/dto";
import USDC_abi from "../react/src/USDC_abi.json";

config({ path: "../.env" });
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PK!, provider);

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});

app.post("/permit", async (req: Request, res: Response) => {
  const inp = req.body as dto.PermitDto;

  try {
    const splitted = ethers.Signature.from(inp.signature);

    // this is not mandatory to check here, will be checked by smart contract's <permit> function.

    // const ownerAddress = ethers.verifyTypedData(
    //   inp.domain,
    //   constants.permitTypes,
    //   inp.values,
    //   splitted
    // );
    // if (ownerAddress != inp.values.owner) {
    //   throw new Error("Signature is not for needed address");
    // }

    const usdcContract = new ethers.Contract(
      constants.usdcAddress,
      USDC_abi,
      wallet
    );

    const tx = await usdcContract.permit(
      inp.values.owner,
      constants.spenderAddress,
      inp.values.value,
      inp.values.deadline,
      splitted.v,
      splitted.r,
      splitted.s,
      {
        gasLimit: 170000,
      }
    );

    console.log(tx);
    tx.wait();
    if (tx.hash) console.log(tx.hash);

    res.status(200).send(req.body);
  } catch (err) {
    res.status(500).send({ error: "" + (err ?? "") });
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
