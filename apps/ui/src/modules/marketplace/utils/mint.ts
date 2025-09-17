import {
    type Account,
    type Provider,
    Contract,
    type FunctionResult,
    type BN,
    bn,
} from 'fuels';
import abi from './collection-contract-abi.json';

const Address = {
    bits: (account: string | Account) => {
        return {
            bits: typeof account === 'string' ? account : account.address.toB256(),
        };
    },
};

export const Identity = {
    address: (account: string | Account) => {
        return {
            Address: Address.bits(account),
        };
    },
};

// Types
type ContentItem =
    | {
        type: 'description';
        title: string;
        text: string;
        align: 'left' | 'center' | 'right';
    }
    | {
        type: 'image';
        value: string;
    };

type AboutSection = ContentItem[];

export type CollectionConfig = {
    name: string;
    description: string;
    banner: string;
    avatar: string;
    previews: string[];
    about: AboutSection[];
};

// Implementation
export class NFTCollection {
    private contract: Contract;

    constructor(
        public id: string,
        private account: Account | Provider
    ) {
        this.contract = new Contract(id, abi, account);
    }

    /**
     * Mints a new NFT by interacting with the associated contract.
     * This method ensures that the account is not a provider, checks the required mint price,
     * verifies the account's balance, and executes the minting process.
     *
     * @return {Promise<Object>} A promise that resolves to the result of the minting operation.
     * Throws an error if the account is a provider or if the balance is insufficient.
     */
    async mint(quantity = 1): Promise<FunctionResult<unknown>> {
        if ('url' in this.account)
            throw new Error('Cannot mint NFTs from a provider');

        const {
            value: [asset, amount],
        } = await this.contract.functions.mint_price!().get();
        const balance = await this.account.getBalance(asset.bits);
        const mintAmount = amount.mul(quantity);

        if (balance.lt(mintAmount)) throw new Error('Insufficient balance');

        const calls = Array.from({ length: quantity }, () =>
            this.contract.functions.mint!(
                undefined,
                Identity.address(this.account as Account)
            ).callParams({
                forward: {
                    assetId: asset.bits,
                    amount,
                },
            })
        );

        const response = await this.contract.multiCall(calls).call();
        return response.waitForResult();
    }

    /**
     * Fetches the collection configuration by retrieving the collection URI from the contract,
     * requesting the data from the URI, and parsing it as JSON.
     *
     * @return {Promise<CollectionConfig>} A promise that resolves to the collection configuration object.
     * @throws {Error} If the fetch request to the URI fails or returns a non-OK status.
     */
    async collectionConfig() {
        const { value } = await this.contract.functions.collection_uri!().get();
        const response = await fetch(value);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch collection config: ${response.statusText}`
            );
        }
        return (await response.json()) as Promise<CollectionConfig>;
    }

    /**
     * Retrieves the maximum supply value from the contract.
     *
     * @return {Promise<any>} A Promise that resolves to the maximum supply value retrieved from the contract.
     */
    async getMaxSupply() {
        const { value } = await this.contract.functions.max_supply!().get();
        return value;
    }

    /**
     * Retrieves the total assets value from the contract.
     *
     * @return {Promise<number>} A promise that resolves to the total assets value.
     */
    async getTotalAssets() {
        const { value } = await this.contract.functions.total_assets!().get();
        return value;
    }

    /**
     * Retrieves the resume mint data from the contract.
     *
     * @return {Promise<{maxSupply: number, totalAssets: number, mintPrice: {asset: string, amount: number}, config: CollectionConfig}>} A promise that resolves to the resume mint data.
     */
    async getResumeMint() {
        const [maxSupply, totalAssets, mintPrice] = await Promise.all([
            this.getMaxSupply(),
            this.getTotalAssets(),
            this.mintPrice(),
        ]);

        return { maxSupply, totalAssets, mintPrice };
    }

    /**
     * Retrieves the mint price of the asset from the contract.
     *
     * @return {Promise<{asset: string, amount: number}>} A promise that resolves with an object containing
     * the asset identifier as a string and the minting amount as a number.
     */
    async mintPrice() {
        const {
            value: [asset, amount],
        } = await this.contract.functions.mint_price!().get();
        return { asset: asset.bits, amount };
    }

    /**
     * Simulates the minting process by creating a transaction request and estimating the fee.
     *
     * @param {number} quantity - The quantity of NFTs to mint.
     * @return {Promise<{ fee: BN }>} A promise that resolves with an object containing the estimated fee.
     */

    async simulateMint(quantity = 1): Promise<{ fee: BN }> {
        if ('url' in this.account)
            throw new Error('Cannot mint NFTs from a provider');

        const {
            value: [asset, amount],
        } = await this.contract.functions.mint_price!().get();

        let fee = bn(0);


        const transactionRequest = await this.contract.functions.mint!(
            undefined,
            Identity.address(this.account as Account)
        )
            .callParams({
                forward: {
                    assetId: asset.bits,
                    amount,
                },
            })
            .getTransactionRequest();

        try {
            const { maxFee, } =
                await this.account.getTransactionCost(transactionRequest);

            const singleMintFee = maxFee;

            fee = singleMintFee.mul(quantity);
        } catch {
            // Fallback fee per mint (around $0.002 USD)
            fee = bn(445).mul(quantity);
        }

        return {
            fee
        };
    }
}
