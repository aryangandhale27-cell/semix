const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SEMIX LABS server running on http://0.0.0.0:${PORT}`);
});
