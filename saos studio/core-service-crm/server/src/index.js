import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve scraped assets
app.use('/assets', express.static(join(__dirname, '../../data/assets')));

// API
app.use('/api', routes);

// In production, serve static client build
const clientDist = join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Core Service CRM running on http://localhost:${PORT}`);
});
