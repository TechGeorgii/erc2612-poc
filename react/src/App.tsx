import { ethers } from "ethers";
import { useEffect, useRef, useState } from 'react';
import USDC_abi from './ABI.json'
import * as constants from './constants'
import { DomainDto, PermitDto, ValuesDto } from "./dto";

(BigInt.prototype as any).toJSON = function () {  // this is to serialize bigint
  return this.toString();
};

function App() {
  const [eoaAddress, setEoaAddress] = useState<string | null>(null);
  const [successPermit, setSuccessPermit] = useState<boolean>(false);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const provider = useRef<ethers.BrowserProvider>();
  const signer = useRef<ethers.Signer>();

  useEffect(() => {
    async function connect() {
      try {
        provider.current = new ethers.BrowserProvider((window as any).ethereum);
        signer.current = await provider.current.getSigner();
        setEoaAddress(await signer.current.getAddress());
        setNetwork((await provider.current?.getNetwork()).name);

        await provider.current.send("eth_requestAccounts", []);
      }
      catch (err) {
        console.error(err);
      }
    }

    connect();
  }, []);

  const sendPermit = async () => {
    setSuccessPermit(false);

    const tokenContract = new ethers.Contract(constants.tokenAddress, USDC_abi, provider.current);
    const [network, decimals, nonce, name, version] = await Promise.all([
      provider.current?.getNetwork(),
      tokenContract.decimals(),
      tokenContract.nonces(eoaAddress),
      tokenContract.name(),
      tokenContract.version()
      // "1"// Hardcoded – for OP Optimism: 1, FXS Optimism: 1
      // for stETH Mainnet – supports EIP-5267, so one can get all domain parameters in one call (not in this code)
    ]);

    //const version = "1";  
    console.log(``)
    console.log(`contract name: ${name}`);

    const values: ValuesDto = {
      owner: eoaAddress!,
      spender: constants.spenderAddress,
      value: ethers.parseUnits("0.1", decimals),
      nonce: nonce,
      deadline: Math.floor(Date.now() / 1000) + 3600,  // 1 hour from now on.
    };

    const domain: DomainDto = {
      chainId: network!.chainId,
      name: name,
      verifyingContract: constants.tokenAddress,
      version: version,
    };

    const signature = await signer.current!.signTypedData(domain, constants.permitTypes, values);
    const payload: PermitDto = {
      signature: signature,
      values: values,
      domain: domain,
    };

    const resp = await fetch("http://localhost:9001/permit", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (resp.status !== 200) {
      throw new Error(`${resp.status} is returned. 200 is expected`);
    }
    setSuccessPermit(true);
  }

  const checkAllowanceClick = async () => {
    setAllowance(null);
    const usdcContract = new ethers.Contract(constants.tokenAddress, USDC_abi, provider.current);
    const [a, decimals] = await Promise.all([
      usdcContract.allowance(eoaAddress, constants.spenderAddress),
      usdcContract.decimals()
    ]);
    console.log(a);
    setAllowance(`owner: ${eoaAddress} spender: ${constants.spenderAddress} allowance: ${ethers.formatUnits(a, decimals)}`);
  }

  return (
    <div className="App">
      {!(window as any).ethereum ? (
        <div>Metamask not installed</div>
      ) :
        (
          <>
            {eoaAddress ? (
              <div>
                <div>
                  Connected: {eoaAddress} on {network}
                </div>
                <div>
                  Token: {constants.tokenAddress}
                </div>
                <div>
                  <button onClick={sendPermit}>Send permit</button>
                  {successPermit ? "Successfully completed" : ""}
                </div>
                <div>
                  <button onClick={checkAllowanceClick}>Check allowance</button>
                  {allowance != null ? (<div>Allowance: {allowance.toString()}</div>) : ""}
                </div>
              </div>
            )
              : (<div>Not connected... please sign Metamask request</div>)}
          </>
        )}
    </div>
  );
}

export default App;

