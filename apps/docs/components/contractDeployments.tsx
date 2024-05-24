// biome-ignore lint/correctness/noUnusedImports: <explanation>
import type React from 'react';

type InfoType = {
  title: string;
  abiUrl: string;
  contractId: string;
  explorerUrl: string;
};

const shorAddress = (address: string) =>
  `${address.slice(0, 10)}...${address.slice(-4)}`;
const makeExplorerLink = (contractId: string) =>
  `https://app.fuel.network/contract/${contractId}/code`;

const infos: Record<string, InfoType> = {
  storage: {
    title: 'Storage Contract',
    abiUrl:
      'https://github.com/infinitybase/bako-id/blob/03b9a9367deae4f164322ec2d883f2c258fda9b0/packages/sway/src/libraries/src/abis.sw#L9-L36',
    contractId: shorAddress(
      '0xfd20cda9d9f4c68d41f5342f4f030d22cc47eb2076a917b5434ba41225dc3c62',
    ),
    explorerUrl: makeExplorerLink(
      '0xf9444a1a12114f944d6a673c9fcc98ab7c16b76ea371d4c52a3e314063f8cccf',
    ),
  },
  register: {
    title: 'Registry Contract',
    abiUrl:
      'https://github.com/infinitybase/bako-id/blob/03b9a9367deae4f164322ec2d883f2c258fda9b0/packages/sway/src/registry-contract/src/abis/registry_contract.sw#L25-L31',
    contractId: shorAddress(
      '0x5fe67d902603cc5e1212c266c5005dd89e914e351fcda85c28004ff6e9172b85',
    ),
    explorerUrl: makeExplorerLink(
      '0x17451bc0d362346968aa204ae892ee9d3ae8c37883b2c04df8768189f0620a4d',
    ),
  },
};

interface ContractDeploymentsProps {
  name: string;
}

export const ContractDeployments: React.FC<ContractDeploymentsProps> = ({
  name,
}) => {
  const contractInfo = infos[name];

  if (!contractInfo) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        border: '1px solid #ffc01026',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          padding: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          height: '100%',
        }}
      >
        <div
          style={{
            width: 'auto',
            display: 'flex',
            gap: '8px',
          }}
        >
          {contractInfo.title}
          <a
            href={contractInfo.abiUrl}
            style={{
              textDecoration: 'underline',
              color: '#ffc010',
            }}
            target="_blank"
            rel="noreferrer"
          >
            ABI
          </a>
        </div>
        <a
          href={contractInfo.explorerUrl}
          style={{
            textDecoration: 'underline',
            color: '#ffc010',
            fontSize: '1.1rem',
            fontWeight: '500',
          }}
          target="_blank"
          rel="noreferrer"
        >
          {contractInfo.contractId}
        </a>
      </div>
    </div>
  );
};
