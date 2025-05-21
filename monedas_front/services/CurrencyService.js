const ExchangerateAdapter = require('../adapters/exchangerateAdapter');
const FrankfurterAdapter   = require('../adapters/FrankfurterAdapter');

class CurrencyService {
  constructor() {
    // Cambia aquí para probar el otro adapter
    this.provider = process.env.PROVIDER === 'frankfurter'
      ? new FrankfurterAdapter()
      : new ExchangerateAdapter();

    this.cache      = new Map();            //  "USD-PEN" → {rate, ts}
    this.cacheTtlMs = 5 * 60 * 1000;        // 5 minutos
  }

  static getInstance() {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async getRate(from, to) {
    const key = `${from}-${to}`;
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && (now - cached.ts) < this.cacheTtlMs) {
      return cached.rate;
    }

    const rate = await this.provider.getRate(from, to);
    this.cache.set(key, { rate, ts: now });
    return rate;
  }
}

module.exports = CurrencyService.getInstance();
