const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, { index: false }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route to serve the app with edge-caching headers for lightning-fast loads
app.get('*', (_req, res) => {
  try {
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res.status(404).send('Build index.html not found.');
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Aggressive caching headers for GoDaddy's CDN to deliver pages instantly to new users
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    return res.send(html);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SEMIX LABS server running on http://0.0.0.0:${PORT}`);
});