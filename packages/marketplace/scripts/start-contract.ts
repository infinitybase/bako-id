import dotenv from "dotenv";
import { type FunctionInvocationScope, Provider, Wallet, bn } from "fuels";
import { Marketplace } from "../src/artifacts";
import { getContractId } from "../src/utils";

dotenv.config();

const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>,
) => {
  const result = await method.call();
  return result.waitForResult();
};

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}
if (!process.env.PROVIDER_URL) { 
  throw new Error("PROVIDER_URL is not set");
}


const provider = new Provider(process.env.PROVIDER_URL!);
const wallet = Wallet.fromPrivateKey(process.env.PRIVATE_KEY!, provider);

async function initialize() {
  const eth = await provider.getBaseAssetId();
  const chainId = await provider.getChainId();
  const marketplace = new Marketplace(getContractId(chainId), wallet);

  await callAndWait(
    marketplace.functions.initialize({
      Address: {
        bits: wallet.address.toB256(),
      },
    }),
  );

  console.info("Marketplace initialized");

  await callAndWait(
  	marketplace.functions.add_valid_asset(
  		{
  			bits: eth,
  		},
  		bn(10).mul(100), // 10% fee
  	),
  );
  console.info("Marketplace added valid asset");
}

initialize();

