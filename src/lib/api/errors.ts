export class CurrencyApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'CurrencyApiError';
  }
}

export class ExchangeRateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExchangeRateError';
  }
}