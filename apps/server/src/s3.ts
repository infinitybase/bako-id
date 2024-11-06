import type { OffChainData } from '@bako-id/sdk';
import AWS from 'aws-sdk';

const { AWS_REGION, AWS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const BUCKET_NAME = process.env.BUCKET_NAME ?? 'bako-id';

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const resulverEmpty: OffChainData = {
  resolversName: {},
  resolversAddress: {},
  records: {},
};

export const s3 = new AWS.S3();

export const getJsonFile = async (filename: string): Promise<OffChainData> => {
  return await s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: filename,
    })
    .promise()
    .then((data) => {
      if (!data.Body) {
        return resulverEmpty;
      }
      return JSON.parse(data.Body.toString('utf-8'));
    })
    .catch(() => {
      return resulverEmpty;
    });
};

export const putJsonFile = async (
  filename: string,
  jsonContent: OffChainData
) => {
  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify(jsonContent, null, 2),
      ContentType: 'application/json',
    })
    .promise()
    .then(() => {
      return true;
    })
    .catch((_) => {
      return false;
    });
};
