export async function convert(amount: number, from: string, to: string) {
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from.toUpperCase()}&to=${to.toUpperCase()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rate = data.rates[to.toUpperCase()];
  
  if (rate === undefined) {
    throw new Error(`Exchange rate not found for ${from} to ${to}`);
  }

  return {
    from: data.base,
    to: to.toUpperCase(),
    amount: data.amount,
    result: rate,
    rate: rate / amount,
    date: data.date
  };
}

export async function getRate(from: string, to: string) {
  const url = `https://api.frankfurter.app/latest?from=${from.toUpperCase()}&to=${to.toUpperCase()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rate = data.rates[to.toUpperCase()];

  if (rate === undefined) {
    throw new Error(`Exchange rate not found for ${from} to ${to}`);
  }

  return {
    from: data.base,
    to: to.toUpperCase(),
    rate: rate,
    date: data.date
  };
}

export async function getHistoricalRate(from: string, to: string, date: string) {
  // Simple validation for YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  const url = `https://api.frankfurter.app/${date}?from=${from.toUpperCase()}&to=${to.toUpperCase()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rate = data.rates[to.toUpperCase()];

  if (rate === undefined) {
    throw new Error(`Exchange rate not found for ${from} to ${to} on ${date}`);
  }

  return {
    from: data.base,
    to: to.toUpperCase(),
    rate: rate,
    date: data.date
  };
}

export async function listCurrencies(): Promise<Record<string, string>> {
  const url = `https://api.frankfurter.app/currencies`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
  }

  return await response.json() as Record<string, string>;
}

export const plugin = {
  name: 'helm-skill-currency',
  operations: {
    convert: { permission: 'allow', handler: convert },
    getRate: { permission: 'allow', handler: getRate },
    getHistoricalRate: { permission: 'allow', handler: getHistoricalRate },
    listCurrencies: { permission: 'allow', handler: listCurrencies }
  }
};
