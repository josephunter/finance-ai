const FIXER_API_KEY = 'aba34e04568b55f652ee4d947a084ee9';
const FIXER_API_BASE = 'https://data.fixer.io/api';

export async function getHistoricalRate(
  date: string,
  from: string,
  to: string
): Promise<number> {
  try {
    const response = await fetch(
      `${FIXER_API_BASE}/${date}?access_key=${FIXER_API_KEY}&base=${from}&symbols=${to}`
    );
    console.log(`${FIXER_API_BASE}/${date}?access_key=${FIXER_API_KEY}&base=${from}&symbols=${to}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.info || 'Failed to fetch exchange rate');
    }
    
    return data.rates[to];
  } catch (error) {
    console.error('Error fetching historical rate:', error);
    throw error;
  }
}