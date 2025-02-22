import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt , { Secret }from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user';
import CarTracking from '../models/carTracking';
import tokenAuth from '../middlewares/tokenAuth';
import { saveLog , getTokenFromHeader } from "../utils/logger";

const router: Router = Router();

dotenv.config();

// post
router.post('/',tokenAuth ,async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "insert";
    const message = `${newUser}`;
    const userType = decode ? decode.type : 'Guest';
    const userId = decode ? decode.userId : '';
    const path = `/car/${newUser._id}`;

    try {
      await saveLog(type, message, userType, userId, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }

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


// validate password
router.post('/validate-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);

    res.status(200).json({ isValid });
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).send('Server error');
  }
});

//update
router.put('/:id', tokenAuth ,async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const existingUser =  await User.findById(req.params.id);
    const message = `${existingUser} `;
        if (!existingUser)
        {
          res.status(404).json({'error':'Owner not found'});
          return;
        }
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    existingUser.name = updates.name || existingUser.name;
    existingUser.email = updates.email || existingUser.email;
    existingUser.type = updates.type || existingUser.type;
    existingUser.password = updates.password || existingUser.password;

    const updatedUser = await existingUser.save();

    const decode = getTokenFromHeader(req);
    // Log details
    const type = "update";
    const userType = decode ? decode.type : 'Guest';
    const userIdAdd = decode ? decode.userId : '';
    const path = `/car/${existingUser._id}`;

    try {
      await saveLog(type, message, userType, userIdAdd, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
    }

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error');
  }
});



// Delete 
router.delete('/:id', tokenAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
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
    const decode = getTokenFromHeader(req);
    // Log details
    const type = "delete";
    const message = `${deletedUser}`;
    const userType = decode ? decode.type : 'Guest';
    const userIdAdd = decode ? decode.userId : '';
    const path = `/car/${deletedUser._id}`;

    try {
      await saveLog(type, message, userType, userIdAdd, path);
    } catch (logError) {
      console.error("Failed to save log:", logError);
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

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const password = req.body?.password;
    const email = req.body?.email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send('Invalid email or password');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send('Invalid email or password');
      return;
    }

    const token = jwt.sign(
      { userId: user._id, type: user.type ,name: user.name },
      process.env.TOKEN_SECRET as Secret,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
  
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
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
