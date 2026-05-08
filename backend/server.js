require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const calculateRouter = require('./routes/calculate');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' }
});
app.use('/api/', limiter);

app.use('/api', calculateRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası oluştu.' });
});

app.listen(PORT, () => {
  console.log(`RetireSmart TR Backend — Port ${PORT} üzerinde çalışıyor`);
});
