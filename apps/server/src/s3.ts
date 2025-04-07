import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

console.log('ENV', {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export class S3Service {
  static async uploadImageToS3(key: string, file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      const response = await s3Client.send(command);

      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async getFileFromS3(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);

      const chunks: Uint8Array[] = [];

      for await (const chunk of response.Body as Readable) {
        chunks.push(chunk);
      }

      const fileContent = Buffer.concat(chunks);
      const blob = new Blob([fileContent], { type: response.ContentType });
      const file = new File([blob], key, { type: response.ContentType });

      return file;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  static async fileExistsInS3(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      if ((error as Error).name === 'NoSuchKey') {
        return false;
      }

      throw error;
    }
  }
}
