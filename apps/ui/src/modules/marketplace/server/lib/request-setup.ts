import { Provider } from "fuels";
import { Networks, resolveNetwork } from "@/utils/resolverNetwork";

export const requestSetup = async () => {
    const provider = new Provider(
        process.env.PROVIDER_URL || 'https://mainnet.fuel.network/v1/graphql'
    );
    const chainId = (await provider.getChainId()) || Networks.MAINNET;
    const network = resolveNetwork(chainId);
    const marketplaceAPIURL = process.env.MARKETPLACE_API_URL;
    const marketplaceUIURL = process.env.MARKETPLACE_UI_URL;

    return {
        provider,
        chainId,
        network,
        marketplaceAPIURL,
        marketplaceUIURL
    }
}