import { Router, Request, Response, NextFunction } from 'express';
import CarTracking from '../../models/carTracking';

const router: Router = Router();

// post
router.post('/', async (req: Request, res: Response) => {
  try {
    const newCarTracking= new CarTracking(req.body);
    const savedCarTracking = await newCarTracking.save();
    res.status(201).send(savedCarTracking);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all 
router.get('/', async (req: Request, res: Response) => {
  try {
    const CarTrackings = await CarTracking.find({});
    res.status(200).send(CarTrackings);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
