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

export const isIPFS = (url: string) => url.startsWith('ipfs://');

export const isHTTPS = (url: string) => url.startsWith('https://');

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

export { formatAddress, formatTimeWithTimeZone };
