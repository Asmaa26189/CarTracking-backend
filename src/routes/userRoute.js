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
const user_1 = __importDefault(require("../models/user"));
const router = (0, express_1.Router)();
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
// Delete 
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        //const isReferenced = await carTracking.exists({ user: userId });
        // if (isReferenced) {
        //   res.status(400).json({error: 'Cannot delete ,it is referenced in other documents.',});
        //   return;
        // }
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
exports.default = router;
