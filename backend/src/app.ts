import express from 'express';
import cors from 'cors';
import inventoryRouter from './routes/inventory';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/inventory', inventoryRouter);

// Handle 404 errors for non-existent routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle other errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app; 