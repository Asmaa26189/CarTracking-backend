import { Router, Request, Response, NextFunction } from 'express';
import CarTracking from '../models/carTracking';

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

// Get By ID 
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const CarTrackings = await CarTracking.findById(req.params.id);
    if(!CarTrackings)
    {
      res.status(400).json({error: 'Cannot find this CarTracking'});
    }
    res.status(200).send(CarTrackings);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get By USERID 
router.get('/user/:id', async (req: Request, res: Response) => {
    try {
      const CarTrackings = await CarTracking.find({userId:req.params.id});
      if(!CarTrackings)
      {
        res.status(400).json({error: 'Cannot find this CarTracking'});
      }
      res.status(200).send(CarTrackings);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Get By CARID 
router.get('/car/:id', async (req: Request, res: Response) => {
    try {
      const CarTrackings = await CarTracking.find({carId:req.params.id});
      if(!CarTrackings)
      {
        res.status(400).json({error: 'Cannot find this CarTracking'});
      }
      res.status(200).send(CarTrackings);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Get By USERID & CARID
router.get('/carUser', async (req: Request, res: Response) => {
    try {
        const { carId, userId } = req.query;
      const CarTrackings = await CarTracking.find({carId:carId, userId:userId});
      if(!CarTrackings)
      {
        res.status(400).json({error: 'Cannot find this CarTracking'});
      }
      res.status(200).send(CarTrackings);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Delete 
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  const CarTrackingId = req.params.id;

  try {
    const deletedCarTracking = await CarTracking.findByIdAndDelete(CarTrackingId);

    if (!deletedCarTracking) {
      res.status(404).json({ error: 'CarTracking not found' });
      return;
    }

    res.status(200).json({ message: 'CarTracking deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting CarTracking:', err);
    next(err); 
  }
});

export default router;
