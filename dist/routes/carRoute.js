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
const car_1 = __importDefault(require("../models/car"));
const carTracking_1 = __importDefault(require("../models/carTracking"));
const logger_1 = require("../utils/logger");
const tokenAuth_1 = __importDefault(require("../middlewares/tokenAuth"));
const router = (0, express_1.Router)();
// Post route to add a new car
router.post('/', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCar = new car_1.default(req.body);
        const savedCar = yield newCar.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "insert";
        const message = `${newCar}`;
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${newCar._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(201).json(savedCar);
    }
    catch (err) {
        console.error("Error adding car:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// put
router.put('/:id', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingCar = yield car_1.default.findById(req.params.id);
        if (!existingCar) {
            res.status(404).json({ 'error': 'Car not found' });
            return;
        }
        const message = `${existingCar} `;
        existingCar.code = req.body.code || existingCar.code;
        existingCar.type = req.body.type || existingCar.type;
        existingCar.description = req.body.description || existingCar.description;
        existingCar.date = req.body.date || existingCar.date;
        existingCar.ownerId = req.body.ownerId || existingCar.ownerId;
        const updatedCar = yield existingCar.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "update";
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${existingCar._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(201).send(existingCar);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get all 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Cars = yield car_1.default.find({}).populate('ownerId');
        res.status(200).send(Cars);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By ID 
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Cars = yield car_1.default.findById(req.params.id);
        if (!Cars) {
            res.status(400).json({ error: 'Cannot find this Car' });
        }
        res.status(200).send(Cars);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By ID 
router.get('/owner/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Cars = yield car_1.default.find({ 'ownerId': req.params.id });
        if (!Cars) {
            res.status(400).json({ error: 'Cannot find this Car' });
        }
        res.status(200).send(Cars);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Delete 
router.delete('/:id', tokenAuth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CarId = req.params.id;
    try {
        const isReferenced = yield carTracking_1.default.exists({ carId: CarId });
        if (isReferenced) {
            res.status(400).json({ error: 'Cannot delete ,it is referenced in other documents.', });
            return;
        }
        const deletedCar = yield car_1.default.findByIdAndDelete(CarId);
        if (!deletedCar) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "delete";
        const message = `${deletedCar}`;
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${deletedCar._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting Car:', err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=carRoute.js.map