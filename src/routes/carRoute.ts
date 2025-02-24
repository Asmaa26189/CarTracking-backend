import { Router, Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";
import Car from '../models/car';
import CarTracking from '../models/carTracking';
import { saveLog , getTokenFromHeader } from "../utils/logger";
import tokenAuth from '../middlewares/tokenAuth';

const router: Router = Router();

// Post route to add a new car
router.post('/', tokenAuth, async (req: Request, res: Response) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();

    const decode = getTokenFromHeader(req);
    // Log details
    const type = "insert";
    const message = `${newCar}`;
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${newCar._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }

    res.status(201).json(savedCar);
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// put
router.put('/:id', tokenAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const existingCar = await Car.findById(req.params.id);
    if (!existingCar) {
      res.status(404).json({ 'error': 'Car not found' });
      return;
    }
    const message = `${existingCar} `;
    existingCar.code = req.body.code || existingCar.code;
    existingCar.type = req.body.type || existingCar.type;
    existingCar.description = req.body.description || existingCar.description;
    existingCar.date = req.body.date || existingCar.date;
    existingCar.ownerId = req.body.ownerId || existingCar.ownerId;
    existingCar.brand = req.body.brand || existingCar.brand;
    existingCar.model = req.body.model || existingCar.model;
    existingCar.year = req.body.year || existingCar.year;
    existingCar.color = req.body.color || existingCar.color;
    existingCar.engineNumber = req.body.engineNumber || existingCar.engineNumber;
    existingCar.chassisNumber = req.body.chassisNumber || existingCar.chassisNumber;
    existingCar.fuel = req.body.fuel || existingCar.fuel;
    existingCar.mileage = req.body.mileage || existingCar.mileage;
    existingCar.insurance = req.body.insurance || existingCar.insurance;

    const updatedCar = await existingCar.save();
    
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "update";
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${existingCar._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }
    res.status(201).send(existingCar);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all 
router.get('/', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.find({}).populate('ownerId');
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get By ID 
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.findById(req.params.id);
    if (!Cars) {
      res.status(400).json({ error: 'Cannot find this Car' });
    }
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get By ID 
router.get('/owner/:id', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.find({ 'ownerId': req.params.id });
    if (!Cars) {
      res.status(400).json({ error: 'Cannot find this Car' });
    }
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete 
router.delete('/:id', tokenAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const CarId = req.params.id;

  try {

    const isReferenced = await CarTracking.exists({ carId: CarId });

    if (isReferenced) {
      res.status(400).json({ error: 'Cannot delete ,it is referenced in other documents.', });
      return;
    }


    const deletedCar = await Car.findByIdAndDelete(CarId);

    if (!deletedCar) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "delete";
    const message = `${deletedCar}`;
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${deletedCar._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting Car:', err);
    next(err);
  }
});

export default router;