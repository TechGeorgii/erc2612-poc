import { ethers } from "ethers";
import { useState } from 'react';
import ABI from './ABI_ERC20.json'

function App() {
  const [eoaAddress, setEoaAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>();
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [balance, setBalance] = useState<string>();

  const connectWallet= async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    setSigner(signer);
    setProvider(provider);
    setEoaAddress(await signer.getAddress());

    await provider.send("eth_requestAccounts", []);
  }

   const getBalanceClick= async () => {
    const usdtContract = new ethers.Contract(
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT on Polygon mainnet
      ABI,
      provider
    );

    const res = (await Promise.all([usdtContract.balanceOf(eoaAddress), usdtContract.decimals()]));
    console.log(res[0].toString(), res[1]);
    setBalance(ethers.formatUnits(res[0].toString(), res[1]));
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
                      Connected: {eoaAddress}

                      <div>
                      <button onClick={getBalanceClick}>Get USDT balance</button> 
                      <br />
                      {balance ? (<> Balance:<div>{balance}</div></>) : (<></>)}
                      </div>
                    </div>
                  ) 
                : (<button onClick={connectWallet}>Connect wallet</button> )}
            </>
          )}
    </div>
  );
}

export default App;

