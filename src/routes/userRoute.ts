import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/user';

const router: Router = Router();

// post
router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all 
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete 
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  const userId = req.params.id;

  try {

    //const isReferenced = await carTracking.exists({ user: userId });

    // if (isReferenced) {
    //   res.status(400).json({error: 'Cannot delete ,it is referenced in other documents.',});
    //   return;
    // }

    
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    next(err); 
  }
});

export default router;
