import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import connectDB from './connectDB';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
connectDB();

// Routes
app.use('/api', userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});