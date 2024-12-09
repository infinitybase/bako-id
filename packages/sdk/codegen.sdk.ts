import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    './src/graphql/generated/sdk-provider.ts': {
      schema: process.env.API_URL ?? 'http://localhost:8080/v1/graphql',
      documents: 'src/graphql/queries/*.graphql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        nonOptionalTypename: true,
        rawRequest: true,
        useTypeImports: true,
        defaultScalarType: 'string',
        typesPrefix: 'GQL',
        scalars: {
          Boolean: 'boolean',
        },
      },
    },
  },
};
export default config;
