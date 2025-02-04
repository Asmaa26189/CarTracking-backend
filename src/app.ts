import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import connectDB from './connectDB';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from './routes/userRoute';
import carRoute from './routes/carRoute';
import carTrackingRoute from './routes/carTrackingRoute';
import ownerRoute from './routes/ownerRoute';
import session from "express-session";
// import MongoStore from "connect-mongo";



dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB();

//session
// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);


// Routes
app.use('/api/user', userRoute);
app.use('/api/car', carRoute);
app.use('/api/tracking', carTrackingRoute);
app.use('/api/owner', ownerRoute);

app.use((req:Request, res:Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
