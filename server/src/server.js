import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'College Lost and Found API' }));
app.use('/api/items', itemRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await connectDatabase();
  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
