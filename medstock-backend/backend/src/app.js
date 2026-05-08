const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/requests',   require('./routes/requests'));
app.use('/api/repayments', require('./routes/repayments'));
app.use('/api/admin',      require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'MedStock API running' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

module.exports = app;
