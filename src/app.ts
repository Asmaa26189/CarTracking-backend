import express, { Application } from 'express';
import bodyParser from 'body-parser';
import connectDB from './connectDB';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB();

// Routes
app.use('/api/user', require('./routes/user').default);
app.use('/api/car', require('./routes/car').default);
app.use('/api/tracking', require('./routes/carTracking').default);
app.use('/api/owner', require('./routes/owner').default);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
