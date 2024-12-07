export interface CurrencyApiResponse {
  data: {
    [key: string]: {
      [currency: string]: number;
    } | number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface ExchangeRate {
  rate: number;
  timestamp: number;
}