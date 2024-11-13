export const registerContractId =
  '0x622a2844f3304678fee0bb3dedf8eed476dac43c99ea41598ba3a990c568d8a9';

export const registerAbi = {
  programType: 'contract',
  specVersion: '1',
  encodingVersion: '1',
  concreteTypes: [
    {
      type: '()',
      concreteTypeId:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
    },
    {
      type: 'enum RegistryContractError',
      concreteTypeId:
        '80b09233651e30b7fa04b552a421e25fc4ea6dd8c3c8051ad05c9c2b4f6a13ce',
      metadataTypeId: 1,
    },
    {
      type: 'enum lib::validations::NameValidationError',
      concreteTypeId:
        '3d558a9e1ceda727203eccf236db03255f30ce308181b93340f5ffb2e19831d8',
      metadataTypeId: 2,
    },
    {
      type: 'enum standards::src7::Metadata',
      concreteTypeId:
        'f44b531974c6c04e17e66ab54e9868d230b9a24b3710b184399c363f0190180d',
      metadataTypeId: 3,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 4,
    },
    {
      type: 'struct events::NewNameEvent',
      concreteTypeId:
        'de123b38a3d90c3cc5a3b578a47a6105e998b48d85f6fcf34c1b4b3907806a75',
      metadataTypeId: 6,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 11,
    },
    {
      type: 'struct std::string::String',
      concreteTypeId:
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      metadataTypeId: 12,
    },
    {
      type: 'u16',
      concreteTypeId:
        '29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef',
    },
  ],
  metadataTypes: [
    {
      type: 'b256',
      metadataTypeId: 0,
    },
    {
      type: 'enum RegistryContractError',
      metadataTypeId: 1,
      components: [
        {
          name: 'IncorrectAssetId',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidAmount',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AlreadyMinted',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AlreadyInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractNotBeZero',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractNotInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NotOwner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NotFoundName',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum lib::validations::NameValidationError',
      metadataTypeId: 2,
      components: [
        {
          name: 'InvalidLenght',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidChars',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'IsEmpty',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum standards::src7::Metadata',
      metadataTypeId: 3,
      components: [
        {
          name: 'B256',
          typeId: 0,
        },
        {
          name: 'Bytes',
          typeId: 9,
        },
        {
          name: 'Int',
          typeId: 13,
        },
        {
          name: 'String',
          typeId: 12,
        },
      ],
    },
    {
      type: 'enum std::identity::Identity',
      metadataTypeId: 4,
      components: [
        {
          name: 'Address',
          typeId: 7,
        },
        {
          name: 'ContractId',
          typeId: 11,
        },
      ],
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 5,
    },
    {
      type: 'struct events::NewNameEvent',
      metadataTypeId: 6,
      components: [
        {
          name: 'name',
          typeId: 12,
        },
        {
          name: 'name_hash',
          typeId: 0,
        },
        {
          name: 'owner',
          typeId: 4,
        },
        {
          name: 'resolver',
          typeId: 4,
        },
        {
          name: 'asset_id',
          typeId: 8,
        },
      ],
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 7,
      components: [
        {
          name: 'bits',
          typeId: 0,
        },
      ],
    },
    {
      type: 'struct std::asset_id::AssetId',
      metadataTypeId: 8,
      components: [
        {
          name: 'bits',
          typeId: 0,
        },
      ],
    },
    {
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 9,
      components: [
        {
          name: 'buf',
          typeId: 10,
        },
        {
          name: 'len',
          typeId: 13,
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 10,
      components: [
        {
          name: 'ptr',
          typeId: 5,
        },
        {
          name: 'cap',
          typeId: 13,
        },
      ],
    },
    {
      type: 'struct std::contract_id::ContractId',
      metadataTypeId: 11,
      components: [
        {
          name: 'bits',
          typeId: 0,
        },
      ],
    },
    {
      type: 'struct std::string::String',
      metadataTypeId: 12,
      components: [
        {
          name: 'bytes',
          typeId: 9,
        },
      ],
    },
    {
      type: 'u64',
      metadataTypeId: 13,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'name',
          concreteTypeId:
            '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
        },
        {
          name: 'resolver',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
        {
          name: 'period',
          concreteTypeId:
            '29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef',
        },
      ],
      name: 'register',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['write', 'read'],
        },
        {
          name: 'payable',
          arguments: [],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'name',
          concreteTypeId:
            '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
        },
        {
          name: 'key',
          concreteTypeId:
            '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
        },
        {
          name: 'value',
          concreteTypeId:
            'f44b531974c6c04e17e66ab54e9868d230b9a24b3710b184399c363f0190180d',
        },
      ],
      name: 'set_metadata_info',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['write', 'read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'manager_id',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
        {
          name: 'token_id',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'constructor',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '9273072382193316023',
      concreteTypeId:
        '80b09233651e30b7fa04b552a421e25fc4ea6dd8c3c8051ad05c9c2b4f6a13ce',
    },
    {
      logId: '4419591021028812583',
      concreteTypeId:
        '3d558a9e1ceda727203eccf236db03255f30ce308181b93340f5ffb2e19831d8',
    },
    {
      logId: '16001917540453911612',
      concreteTypeId:
        'de123b38a3d90c3cc5a3b578a47a6105e998b48d85f6fcf34c1b4b3907806a75',
    },
  ],
  messagesTypes: [],
  configurables: [],
};