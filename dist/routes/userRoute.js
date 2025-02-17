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
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
dotenv_1.default.config();
// post
router.post('/', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.default(req.body);
        const savedUser = yield newUser.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "insert";
        const message = `${newUser}`;
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${newUser._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
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
// validate password
router.post('/validate-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        res.status(200).json({ isValid });
    }
    catch (error) {
        console.error('Error validating password:', error);
        res.status(500).send('Server error');
    }
}));
//update
router.put('/:id', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const existingUser = yield user_1.default.findById(req.params.id);
        const message = `${existingUser} `;
        if (!existingUser) {
            res.status(404).json({ 'error': 'Owner not found' });
            return;
        }
        if (updates.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            updates.password = yield bcrypt_1.default.hash(updates.password, salt);
        }
        existingUser.name = updates.name || existingUser.name;
        existingUser.email = updates.email || existingUser.email;
        existingUser.type = updates.type || existingUser.type;
        existingUser.password = updates.password || existingUser.password;
        const updatedUser = yield existingUser.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "update";
        const userType = decode ? decode.type : 'Guest';
        const userIdAdd = decode ? decode.userId : '';
        const path = `/car/${existingUser._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userIdAdd, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
}));
// Delete 
router.delete('/:id', tokenAuth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "delete";
        const message = `${deletedUser}`;
        const userType = decode ? decode.type : 'Guest';
        const userIdAdd = decode ? decode.userId : '';
        const path = `/car/${deletedUser._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userIdAdd, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
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
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const password = (_a = req.body) === null || _a === void 0 ? void 0 : _a.password;
        const email = (_b = req.body) === null || _b === void 0 ? void 0 : _b.email.toLowerCase();
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(401).send('Invalid email or password');
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send('Invalid email or password');
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, type: user.type, name: user.name }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
}));
router.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});
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