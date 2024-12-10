import type { CodegenConfig } from '@graphql-codegen/cli';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    './src/graphql/generated/sdk-provider.ts': {
      schema: process.env.GRAPHQL_API_URL ?? 'http://localhost:8080/graphql',
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
