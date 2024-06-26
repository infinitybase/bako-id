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

export { formatAddress, formatTimeWithTimeZone };
