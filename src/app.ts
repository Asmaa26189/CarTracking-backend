import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import connectDB from './connectDB';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './routes/userRoute';
import carRoute from './routes/carRoute';
import carTrackingRoute from './routes/carTrackingRoute';
import ownerRoute from './routes/ownerRoute';
import logRoute from './routes/logRoutes';



dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

//Use JSON body parser before session
app.use(bodyParser.json());
app.use(express.json());
app.use(cors()); // Allow cookies

// MongoDB Connection
connectDB();

app.use((req, res, next) => {
  next();
});

// Define routes AFTER session middleware
app.use('/api/user', userRoute);
app.use('/api/car', carRoute);
app.use('/api/tracking', carTrackingRoute);
app.use('/api/owner', ownerRoute);
app.use('/api/log', logRoute);

app.use((req:Request, res:Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
