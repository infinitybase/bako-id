import { addYears, differenceInYears } from 'date-fns';

// 5 digitos - 0.002 -> (1 ano = 0.002 / 2 anos = 0.004)
// 4 digitos - 0.01  -> (1 ano = 0.01 / 2 anos = 0.02)
// 3 digitos - 0.05  -> (1 ano = 0.05 / 2 anos = 0.1)

const calculateDomainPrice = (domain: string, period: number) => {
  if (!domain) return 0;

  let multiplier = 0;
  if (domain.length === 3) multiplier = 0.05;
  if (domain.length === 4) multiplier = 0.01;
  if (domain.length > 4) multiplier = 0.002;

  return period * multiplier;
};

const calculatePeriodYears = (timestamp?: Date, period?: Date) => {
  if (!timestamp || !period) return 1;

  if (addYears(timestamp, 1).getTime() === period.getTime()) {
    return 1;
  }

  const difference = differenceInYears(period, timestamp);

  return difference + 1;
};

export { calculateDomainPrice, calculatePeriodYears };
