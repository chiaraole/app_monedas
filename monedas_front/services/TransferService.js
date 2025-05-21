const UserService     = require('./userService');
const CurrencyService = require('./CurrencyService');
const HistoryLogger   = require('./historyLogger');

class TransferService {
  constructor() {
    this.observers = [ new HistoryLogger() ];
  }

  async transfer({ fromUser, toUser, amount, fromCur, toCur }) {
    if (amount <= 0) throw new Error('Monto inválido');

    const rate = fromCur === toCur ? 1 : await CurrencyService.getRate(fromCur, toCur);
    const converted = +(amount * rate).toFixed(2);

    // Actualiza saldos
    if (fromCur === 'PEN')
      UserService.updateBalances(fromUser, -amount, 0);
    else
      UserService.updateBalances(fromUser, 0, -amount);

    if (toCur === 'PEN')
      UserService.updateBalances(toUser, converted, 0);
    else
      UserService.updateBalances(toUser, 0, converted);

    const event = {
      id: Date.now().toString(36),
      ts:  new Date().toISOString(),
      from: fromUser,
      to:   toUser,
      amount,
      fromCur,
      toCur,
      converted,
      rate
    };

    this.notify(event);
    return event;
  }

  notify(event) {
    this.observers.forEach(obs => obs.update(event));
  }
}

module.exports = new TransferService();
