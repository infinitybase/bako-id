import { format } from 'date-fns';

const formatAddress = (address: string, factor?: number) => {
  const size = factor ?? 10;

  if (!address) return;
  return `${address.slice(0, size)}...${address.slice(-1 * (size / 2))}`;
};

const formatTimeWithTimeZone = (date: Date): string => {
  // Formatar a hora
  const time = format(date, 'HH:mm:ss');

  // Obter o offset de fuso horário em minutos e convertê-lo para horas e minutos
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const sign = timezoneOffset >= 0 ? '+' : '-';

  // Construir a string de fuso horário no formato GMT ±HH:MM
  const formattedTimezone = `GMT ${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

  return `${time} ${formattedTimezone}`;
};

export const isIPFS = (url: string) => Boolean(url?.startsWith('ipfs://'));

export const isHTTPS = (url: string) => Boolean(url?.startsWith('https://'));

export const IPFStoHTTP = (url: string) =>
  isIPFS(url) ? `https://ipfs.io/ipfs/${url.slice(7)}` : url;

export const parseURI = (uri: string) => {
  if (isHTTPS(uri)) return uri;

  if (isIPFS(uri)) return IPFStoHTTP(uri);

  return uri;
};

export const isUrl = (url: string) => !!url?.startsWith?.('https');

export const metadataArrayToObject = (
  metadata: Record<string, string>[],
  key: string
) => {
  return metadata
    .map((v) => {
      const keyValue = Object.keys(v).find((k) => k !== 'value');
      const keyName = v[keyValue!].toLowerCase().replace(' ', '-');
      return {
        key: `${key}:${keyName}`,
        value: v.value,
      };
    })
    .reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>
    );
};

export function objectToGetParams(object: {
  [key: string]: string | number | undefined | null;
}) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length > 0 ? `?${params.join('&')}` : '';
}

export const twitterLink = (
  url: string,
  {
    title,
    via,
    hashtags = [],
    related = [],
  }: { title?: string; via?: string; hashtags?: string[]; related?: string[] }
) =>
  `https://twitter.com/intent/tweet${objectToGetParams({
    url,
    text: title,
    via,
    hashtags: hashtags.length > 0 ? hashtags.join(',') : undefined,
    related: related.length > 0 ? related.join(',') : undefined,
  })}`;

export const formatMetadataFromIpfs = (metadata: Record<string, string>) => {
  const metadataEntries = Object.entries(metadata).filter(
    ([key]) => !key.toLowerCase().includes('uri')
  );
  const metadataObject: Record<string, string> = {};
  for (const [key, value] of metadataEntries) {
    if (Array.isArray(value)) {
      const metadataValueRecord = metadataArrayToObject(value, key);
      Object.assign(metadataObject, metadataValueRecord);
      delete metadataObject[key];
      continue;
    }
    if (metadataObject[key] === undefined) {
      const metadataValue = value as string;
      metadataObject[key] = metadataValue as string;
    }
  }
  return metadataObject;
};

export const fetchMetadata = async (
  uri: string
): Promise<Record<string, string>> => {
  try {
    const response = await fetch(parseURI(uri));
    const json = await response.json();
    return json;
  } catch {
    return {};
  }
};

export const usdValueFormatter = (value: number) => {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const orderPriceFormatter = (value: number) => {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value);
};

export { formatAddress, formatTimeWithTimeZone };
