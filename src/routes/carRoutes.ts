import { Router, Request, Response, NextFunction } from 'express';
import Car from '../models/car';

const router: Router = Router();
// Get all 
router.get('/owner', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.find({});
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;