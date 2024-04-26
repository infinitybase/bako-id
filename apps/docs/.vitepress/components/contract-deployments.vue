<template>
  <div class="container">
    <div class="wrapper">
      <div>
        <div class="name">
          {{ contractInfo?.title }}
          <a :href="contractInfo?.abiUrl" target="_blank">ABI</a>
        </div>
      </div>
      <a :href="contractInfo?.explorerUrl" target="_blank">{{
        contractInfo?.contractId
      }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['name']);

const shorAddress = (address: string) =>
  `${address.slice(0, 10)}...${address.slice(-4)}`;
const makeExplorerLink = (contractId: string) =>
  `https://app.fuel.network/contract/${contractId}/code`;

const infos = {
  storage: {
    title: 'Storage Contract',
    abiUrl:
      'https://github.com/infinitybase/bako-id/blob/d664075ed2b1f98d0c056ecb23557b27a4367e0a/packages/sway/src/libraries/src/abis.sw#L5-L26',
    contractId: shorAddress(
      '0xa28d0490692cd32bf2088f327b05c2b7c82442e8a4ac257c2ca3bf2e3eda8779',
    ),
    explorerUrl: makeExplorerLink(
      '0xf9444a1a12114f944d6a673c9fcc98ab7c16b76ea371d4c52a3e314063f8cccf',
    ),
  },
  register: {
    title: 'Registry Contract',
    abiUrl:
      'https://github.com/infinitybase/bako-id/blob/d664075ed2b1f98d0c056ecb23557b27a4367e0a/packages/sway/src/registry-contract/src/interface.sw#L11-L20',
    contractId: shorAddress(
      '0xdbde82e4cbe560ccaa268b6e3de81951ee2a5e0c185dc58763e35c84e863f51b',
    ),
    explorerUrl: makeExplorerLink(
      '0x17451bc0d362346968aa204ae892ee9d3ae8c37883b2c04df8768189f0620a4d',
    ),
  },
};

type InfoType = (typeof infos)[keyof typeof infos];

// @bio
const contractInfo = infos[props.name] as InfoType;
</script>

<style scoped>
.container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #ffc01026;
  border-radius: 8px;
}

.container .divider {
  width: 100%;
  background-color: #ffc01026;
  margin: 0;
}

.container .wrapper {
  width: 100%;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.container img {
  max-width: 30px;
  border-radius: 5px;
}
</style>
