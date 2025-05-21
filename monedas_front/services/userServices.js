const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/db.json');
const db = low(adapter);

db.defaults({ users: [], history: [] }).write();

class UserService {
  static getUsers() {
    return db.get('users').value();
  }

  static getUser(id) {
    return db.get('users').find({ id }).value();
  }

  static updateBalances(id, penDelta = 0, usdDelta = 0) {
    const user = db.get('users').find({ id }).value();
    if (!user) throw new Error('Usuario no existe');
    if (user.pen + penDelta < 0 || user.usd + usdDelta < 0)
      throw new Error('Fondos insuficientes');

    db.get('users')
      .find({ id })
      .assign({ pen: user.pen + penDelta, usd: user.usd + usdDelta })
      .write();
    return this.getUser(id);
  }
}

module.exports = UserService;
