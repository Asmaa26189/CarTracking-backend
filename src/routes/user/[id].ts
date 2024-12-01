import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt , { Secret }from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/user';
import CarTracking from '../../models/carTracking';
import tokenAuth from '../../middlewares/tokenAuth';

const router: Router = Router();

dotenv.config();

// Get By ID 
router.get('/:id', async (req: Request, res: Response) => {
    try {
      const users = await User.findById(req.params.id);
      if(!users)
      {
        res.status(400).json({error: 'Cannot find this user'});
      }
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  // Delete 
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
    const userId = req.params.id;
  
    try {
  
      const isReferenced = await CarTracking.exists({ userId: userId });
  
      if (isReferenced) {
        res.status(400).json({error: 'Cannot delete ,it is referenced in other documents.',});
        return;
      }
  
      
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
  
  router.post('/register', async (req: Request, res: Response):Promise<void> => {
    try {
      const { name, email, password, type } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) res.status(400).send('User already exists');
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const user = new User({ name, email, password: hashedPassword, type });
      await user.save();
  
      res.status(201).send('User created successfully');
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
  // public - Login a user
  router.post('/login', async (req: Request, res: Response):Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
  
      // Compare the entered password with the stored hashed password
      if(user){
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        res.status(401).send('Invalid email or password');
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          type: user.type,
        },
        process.env.TOKEN_SECRET as Secret ,
        { expiresIn: '1h' }
      );
  
      res.send({
        token,
      });
    }
    res.status(401).send('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Server error');
    }
  });
  
  
  // protected - Get user profile
  router.post('/profile', tokenAuth, async (req: Request, res:Response):Promise<void> => {
    try {
      const user = await User.findById(req.body.user.userId).select('-password'); // Exclude password
      if (!user) {
        res.status(404).send('User not found');
        // return;
      }
      res.send(user);
    } catch (error) {
      res.status(500).send('Server error');
      // return;
    }
  });
  
  
  
  export default router;
  