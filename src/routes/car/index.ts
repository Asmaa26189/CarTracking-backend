import { Router, Request, Response, NextFunction } from 'express';
import Car from '../../models/car';

const router: Router = Router();

// post
router.post('/', async (req: Request, res: Response) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).send(savedCar);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all 
router.get('/', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.find({});
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});


export default router;