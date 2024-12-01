import { Router, Request, Response, NextFunction } from 'express';
import Car from '../models/car';
import CarTracking from '../models/carTracking';

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

// Get By ID 
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.findById(req.params.id);
    if(!Cars)
    {
      res.status(400).json({error: 'Cannot find this Car'});
    }
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get By ID 
router.get('/owner/:id', async (req: Request, res: Response) => {
  try {
    const Cars = await Car.find({'ownerId': req.params.id});
    if(!Cars)
    {
      res.status(400).json({error: 'Cannot find this Car'});
    }
    res.status(200).send(Cars);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete 
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  const CarId = req.params.id;

  try {

    const isReferenced = await CarTracking.exists({ carId: CarId });

    if (isReferenced) {
      res.status(400).json({error: 'Cannot delete ,it is referenced in other documents.',});
      return;
    }

    
    const deletedCar = await Car.findByIdAndDelete(CarId);

    if (!deletedCar) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting Car:', err);
    next(err); 
  }
});

export default router;