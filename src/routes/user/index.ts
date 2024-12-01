import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt , { Secret }from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/user';
import CarTracking from '../../models/carTracking';
import tokenAuth from '../../middlewares/tokenAuth';

const router: Router = Router();

dotenv.config();

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

export default router;
