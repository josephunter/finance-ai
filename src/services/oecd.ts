// Temporarily disabled OECD API calls
export async function getInflationRates(currency: string): Promise<{ [key: string]: number }> {
  // Return mock data
  return {
    '2024-01': 0.05,
    '2023-12': 0.05,
    '2023-11': 0.05,
    '2023-10': 0.05,
  };
}

export async function getLatestInflationRate(currency: string): Promise<number> {
  return 0.05; // 5% fixed rate
}

export async function calculateCumulativeInflation(
  fromDate: string,
  currency: string
): Promise<number> {
  const startDate = new Date(fromDate);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                    (now.getMonth() - startDate.getMonth());
  
  // Use fixed 5% annual rate
  const annualRate = 0.05;
  const monthlyRate = annualRate / 12;
  return Math.pow(1 + monthlyRate, monthsDiff) - 1;
}