import { Router, Request, Response, NextFunction } from 'express';
import Owner from '../models/owner';
import Car from '../models/car';
import { saveLog , getTokenFromHeader } from "../utils/logger";
import tokenAuth from '../middlewares/tokenAuth';

const router: Router = Router();

// post
router.post('/', tokenAuth ,async (req: Request, res: Response) => {
  try {
    const newOwner = new Owner(req.body);
    const savedOwner = await newOwner.save();
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "insert";
    const message = `${newOwner}`;
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${newOwner._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }
    res.status(201).send(savedOwner);
  } catch (err) {
    res.status(500).send(err);
  }
});

// put
router.put('/:id', tokenAuth ,async (req: Request, res: Response):Promise<void> => {
  try {
    const existingOwner =  await Owner.findById(req.params.id);
    if (!existingOwner)
    {
      res.status(404).json({'error':'Owner not found'});
      return;
    }
    const message = `${existingOwner} `;
    existingOwner.name = req.body.name || existingOwner.name;
    existingOwner.phone = req.body.phone || existingOwner.phone;
    existingOwner.notes = req.body.notes || existingOwner.notes;

    const updatedOwner = await existingOwner.save();
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "update";
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${existingOwner._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }
    res.status(201).send(existingOwner);
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

// Get By ID 
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const owners = await Owner.findById(req.params.id);
    if(!owners)
    {
      res.status(400).json({error: 'Cannot find this owner'});
    }
    res.status(200).send(owners);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete 
router.delete('/:id', tokenAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  const ownerId = req.params.id;

  try {
    const isReferenced = await Car.exists({ ownerId: ownerId });

    if (isReferenced) {
      res.status(400).json({error: 'Cannot delete ,it is referenced in other documents.',});
      return;
    }

    
    const deletedOwner = await Owner.findByIdAndDelete(ownerId);

    if (!deletedOwner) {
      res.status(404).json({ error: 'Owner not found' });
      return;
    }

    const decode = getTokenFromHeader(req);
    // Log details
    const type = "delete";
    const message = `${deletedOwner}`;
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${deletedOwner._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }


    res.status(200).json({ message: 'Owner deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting owner:', err);
    next(err); 
  }
});

export default router;
