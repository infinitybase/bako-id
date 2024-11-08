import { FuelGlobalProcessor, FuelNetwork } from '@sentio/sdk/fuel';
import { getDecodedLogs, InputType } from 'fuels';
import { registerAbi } from './abi/register.js';
import { managerAbi, managerContractId } from './abi/manager.js';
import { nftAbi, nftContractId } from './abi/nft.js';
import { ManagerContractProcessor } from './types/fuel/ManagerContractProcessor.js';

// const contractId =
//   '0x622a2844f3304678fee0bb3dedf8eed476dac43c99ea41598ba3a990c568d8a9';
const script =
  '0x724028d8724428b05d451000724828b82d41148a72402980724429585d451000724829602d41148a24040000';

const contract_list = [
  '0x363dbc9fd3449328ab645cb5bf6cd3f6720b8c3382ba54510670014ae5dfa6f9',
  '0x60e8f2a6f963ff233bf47696812e5332e199f183b1e3da2c9b79736e608247da',
  '0x622a2844f3304678fee0bb3dedf8eed476dac43c99ea41598ba3a990c568d8a9',
  '0xd55d84ab1b83c856472e166df72c88c40f0dd5391d3f9a1ffab0d19e9d3a2435',
];
const startBlock = 15063670n;

// RegisterContractProcessor.bind({
//   startBlock,
//   address: contractId,
//   chainId: FuelNetwork.TEST_NET,
// })
//   .onLogNewNameEvent((event) => {
//     console.log('New name event:', event);
//   })
//   .onTransaction((tx) => {
//     console.log('Transaction:', tx);
//   });
ManagerContractProcessor.bind({
  startBlock,
  address: managerContractId,
  chainId: FuelNetwork.TEST_NET,
});

// FuelGlobalProcessor.bind({
//   startBlock,
//   chainId: FuelNetwork.TEST_NET,
// }).onTransaction((tx) => {
//   // preview filter
//   if (script !== tx.transaction.script) return;

//   // filter by registry contract call
//   const inputs_contract_id = [];
//   tx.transaction.inputs?.map((input) => {
//     if (
//       input.type === InputType.Contract &&
//       contract_list.includes(input.contractID)
//     ) {
//       inputs_contract_id.push(input.contractID);
//     }
//   });
//   const isValid = inputs_contract_id.length === 4;
//   if (!isValid) return;
//   console.log(
//     getDecodedLogs(tx.receipts, registerAbi, {
//       [managerContractId]: managerAbi,
//       [nftContractId]: nftAbi,
//     }),
//   );
// });
