import { Router, Request, Response, NextFunction } from 'express';
import Owner from '../../models/owner';
import Car from '../../models/car';

const router: Router = Router();

// post
router.post('/', async (req: Request, res: Response) => {
  try {
    const newOwner = new Owner(req.body);
    const savedOwner = await newOwner.save();
    res.status(201).send(savedOwner);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all 
router.get('/', async (req: Request, res: Response) => {
  try {
    const owners = await Owner.find({});
    res.status(200).send(owners);
  } catch (err) {
    res.status(500).send(err);
  }
});


export default router;
