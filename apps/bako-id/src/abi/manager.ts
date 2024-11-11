export const managerContractId =
  '0x60e8f2a6f963ff233bf47696812e5332e199f183b1e3da2c9b79736e608247da';

export const managerAbi = {
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
      type: 'enum ManagerError',
      concreteTypeId:
        '00b1211efa160123969a7efe1d4597cdb9c6b6e4b311f933e55760a79e7c28fb',
      metadataTypeId: 1,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 2,
    },
    {
      type: 'enum std::option::Option<enum std::identity::Identity>',
      concreteTypeId:
        '253aea1197e8005518365bd24c8bc31f73a434fac0f7350e57696edfdd4850c2',
      metadataTypeId: 3,
      typeArguments: [
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      ],
    },
    {
      type: 'enum std::option::Option<struct lib::abis::manager::RecordData>',
      concreteTypeId:
        'f9212aadfc7e62516fa2ffae7be391807a1a2ec3dd63b662a25fd394cb0f8871',
      metadataTypeId: 3,
      typeArguments: [
        'a06087fea05d71c273e06e235102af0ef06e08660df4f94ecbe49e7f96ab4635',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::string::String>',
      concreteTypeId:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      metadataTypeId: 3,
      typeArguments: [
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      ],
    },
    {
      type: 'enum std::option::Option<u64>',
      concreteTypeId:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      metadataTypeId: 3,
      typeArguments: [
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      ],
    },
    {
      type: 'struct lib::abis::manager::RecordData',
      concreteTypeId:
        'a06087fea05d71c273e06e235102af0ef06e08660df4f94ecbe49e7f96ab4635',
      metadataTypeId: 6,
    },
    {
      type: 'struct std::string::String',
      concreteTypeId:
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      metadataTypeId: 11,
    },
    {
      type: 'u64',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
    },
  ],
  metadataTypes: [
    {
      type: 'b256',
      metadataTypeId: 0,
    },
    {
      type: 'enum ManagerError',
      metadataTypeId: 1,
      components: [
        {
          name: 'OnlyOwner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'RecordNotFound',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'RecordAlreadyExists',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractNotInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractAlreadyInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum std::identity::Identity',
      metadataTypeId: 2,
      components: [
        {
          name: 'Address',
          typeId: 7,
        },
        {
          name: 'ContractId',
          typeId: 10,
        },
      ],
    },
    {
      type: 'enum std::option::Option',
      metadataTypeId: 3,
      components: [
        {
          name: 'None',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Some',
          typeId: 4,
        },
      ],
      typeParameters: [4],
    },
    {
      type: 'generic T',
      metadataTypeId: 4,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 5,
    },
    {
      type: 'struct lib::abis::manager::RecordData',
      metadataTypeId: 6,
      components: [
        {
          name: 'owner',
          typeId: 2,
        },
        {
          name: 'resolver',
          typeId: 2,
        },
        {
          name: 'period',
          typeId: 12,
        },
        {
          name: 'timestamp',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
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
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 8,
      components: [
        {
          name: 'buf',
          typeId: 9,
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 9,
      components: [
        {
          name: 'ptr',
          typeId: 5,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::contract_id::ContractId',
      metadataTypeId: 10,
      components: [
        {
          name: 'bits',
          typeId: 0,
        },
      ],
    },
    {
      type: 'struct std::string::String',
      metadataTypeId: 11,
      components: [
        {
          name: 'bytes',
          typeId: 8,
        },
      ],
    },
    {
      type: 'u16',
      metadataTypeId: 12,
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
          name: 'data',
          concreteTypeId:
            'a06087fea05d71c273e06e235102af0ef06e08660df4f94ecbe49e7f96ab4635',
        },
      ],
      name: 'set_record',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
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
          name: 'resolver',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'set_resolver',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'resolver',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'get_name',
      output:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
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
      ],
      name: 'get_owner',
      output:
        '253aea1197e8005518365bd24c8bc31f73a434fac0f7350e57696edfdd4850c2',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
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
      ],
      name: 'get_record',
      output:
        'f9212aadfc7e62516fa2ffae7be391807a1a2ec3dd63b662a25fd394cb0f8871',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
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
      ],
      name: 'get_resolver',
      output:
        '253aea1197e8005518365bd24c8bc31f73a434fac0f7350e57696edfdd4850c2',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
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
      ],
      name: 'get_ttl',
      output:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'owner',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
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
      logId: '49857487806267683',
      concreteTypeId:
        '00b1211efa160123969a7efe1d4597cdb9c6b6e4b311f933e55760a79e7c28fb',
    },
  ],
  messagesTypes: [],
  configurables: [],
};
