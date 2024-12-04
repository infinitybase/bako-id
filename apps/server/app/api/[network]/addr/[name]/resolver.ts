import { FILENAME, getJsonFile } from '@/s3';
import { validateNetwork } from '@/utils';

export const getResolver = async (name: string, network: string) => {
  const { chainId } = validateNetwork(network);
  const resovlerFileName = `${chainId}/${FILENAME}`;
  const offChainData = await getJsonFile(resovlerFileName);
  const address =
    offChainData.resolversName[name.toString().replace('@', '') as string];
  return address;
};
