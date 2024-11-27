import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import carRoute from './routes/carRoute';
import carTrackingRoute from './routes/carTrackingRoute';
import ownerRoute from './routes/ownerRoute';
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
app.use('/api/user', userRoute);
app.use('/api/car', carRoute);
app.use('/api/tracking', carTrackingRoute);
app.use('/api/owner', ownerRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});