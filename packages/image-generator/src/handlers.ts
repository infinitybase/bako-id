import { generate } from './generate';
import { isValidDomain } from './utils';

type GenerateImageEvent = {
  pathParameters: {
    domain: string;
  };
};

async function handleImage(domain: string) {
  if (!isValidDomain(domain)) {
    return {
      statusCode: 400,
      body: 'Invalid domain',
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    };
  }

  const imgBuffer = await generate(domain);
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31557600',
    },
    body: imgBuffer.toString('base64'),
  };
}

async function handleJson(domain: string) {
  return {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31557600',
    },
    body: JSON.stringify({
      name: domain,
      image: `https://images.fuel.domains/${domain}`,
      attributes: [],
    }),
  };
}

const JSON_END = '.json';

export async function generateImage(event: GenerateImageEvent) {
  const { domain } = event.pathParameters;
  if (domain.endsWith(JSON_END)) {
    return handleJson(domain.replace(JSON_END, ''));
  }
  return handleImage(domain);
}
