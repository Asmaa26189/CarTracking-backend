"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const carTracking_1 = __importDefault(require("../models/carTracking"));
const tokenAuth_1 = __importDefault(require("../middlewares/tokenAuth"));
const router = (0, express_1.Router)();
dotenv_1.default.config();
// post
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.default(req.body);
        const savedUser = yield newUser.save();
        res.status(201).send(savedUser);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get all 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By ID 
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findById(req.params.id);
        if (!users) {
            res.status(400).json({ error: 'Cannot find this user' });
        }
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Delete 
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const isReferenced = yield carTracking_1.default.exists({ userId: userId });
        if (isReferenced) {
            res.status(400).json({ error: 'Cannot delete ,it is referenced in other documents.', });
            return;
        }
        const deletedUser = yield user_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        next(err);
    }
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, type } = req.body;
        // Check if the user already exists
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser)
            res.status(400).send('User already exists');
        // Hash the password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create a new user
        const user = new user_1.default({ name, email, password: hashedPassword, type });
        yield user.save();
        res.status(201).send('User created successfully');
    }
    catch (error) {
        res.status(500).send('Server error');
    }
}));
// public - Login a user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = yield user_1.default.findOne({ email });
        // Compare the entered password with the stored hashed password
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).send('Invalid email or password');
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({
                userId: user._id,
                type: user.type,
            }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            res.send({
                token,
            });
        }
        res.status(401).send('Invalid email or password');
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
}));
// protected - Get user profile
router.post('/profile', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.body.user.userId).select('-password'); // Exclude password
        if (!user) {
            res.status(404).send('User not found');
            // return;
        }
        res.send(user);
    }
    catch (error) {
        res.status(500).send('Server error');
        // return;
    }
}));
exports.default = router;
//# sourceMappingURL=userRoute.js.map