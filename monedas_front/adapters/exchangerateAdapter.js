// Fuente: https://open.er-api.com
const fetch = require('node-fetch');

class ExchangerateAdapter {
  async getRate(from, to) {
    const url = `https://open.er-api.com/v6/latest/${from}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Exchangerate falló');
    const data = await res.json();
    return data.rates[to];
  }
}

module.exports = ExchangerateAdapter;
