// Fuente: https://api.frankfurter.app
const fetch = require('node-fetch');

class FrankfurterAdapter {
  async getRate(from, to) {
    const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Frankfurter falló');
    const data = await res.json();
    return data.rates[to];
  }
}

module.exports = FrankfurterAdapter;
