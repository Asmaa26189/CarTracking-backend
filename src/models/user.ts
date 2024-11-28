import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  name: string;
  email:string;
  type:string;
  password:string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true, default: 'Admin'},
  password: { type: String, required: true },
});


// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);

    next(); // Proceed with save
  } catch (error:any) {
    next(error); // Pass error to the next middleware
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


