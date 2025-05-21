const express          = require('express');
const UserService      = require('./services/userService');
const CurrencyService  = require('../services/CurrencyService');
const TransferService  = require('../services/transferService');
const HistoryLogger    = require('../services/historyLogger');

const app  = express();
const PORT = 3000;

app.use(express.json());

const cors = require('cors');
app.use(cors());                 // permite peticiones desde http://127.0.0.1:5500, Live Server, etc.

// ----- Rutas -------------------------------------------------
app.get('/users', (req, res) => {
  res.json(UserService.getUsers());
});

app.get('/accounts/:id', (req, res) => {
  const user = UserService.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no existe' });
  res.json({ pen: user.pen, usd: user.usd });
});

app.get('/rate', async (req, res) => {
  const { from, to } = req.query;
  try {
    const rate = await CurrencyService.getRate(from, to);
    res.json({ rate });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/transfer', async (req, res) => {
  try {
    const event = await TransferService.transfer(req.body);
    res.json(event);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/history/:id', (req, res) => {
  res.json(HistoryLogger.getHistory(req.params.id));
});

// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✔ Backend listo en http://localhost:${PORT}`);
});
