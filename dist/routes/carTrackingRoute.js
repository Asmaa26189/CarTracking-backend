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
const carTracking_1 = __importDefault(require("../models/carTracking"));
const router = (0, express_1.Router)();
// post
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCarTracking = new carTracking_1.default(req.body);
        const savedCarTracking = yield newCarTracking.save();
        res.status(201).send(savedCarTracking);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get all 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CarTrackings = yield carTracking_1.default.find({}).populate('userId').populate('carId');
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By ID 
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CarTrackings = yield carTracking_1.default.findById(req.params.id).populate('carId');
        if (!CarTrackings) {
            res.status(400).json({ error: 'Cannot find this CarTracking' });
        }
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By USERID 
router.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CarTrackings = yield carTracking_1.default.find({ userId: req.params.id });
        if (!CarTrackings) {
            res.status(400).json({ error: 'Cannot find this CarTracking' });
        }
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By OWNERID 
// router.get('/owner/:id', async (req: Request, res: Response) => {
//   try {
//     const CarTrackings = await CarTracking.find({ownerId:req.params.id});
//     if(!CarTrackings)
//     {
//       res.status(400).json({error: 'Cannot find this CarTracking'});
//     }
//     res.status(200).send(CarTrackings);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// Get By CARID 
router.get('/car/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CarTrackings = yield carTracking_1.default.find({ carId: req.params.id });
        if (!CarTrackings) {
            res.status(400).json({ error: 'Cannot find this CarTracking' });
        }
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By USERID & CARID
router.get('/carUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId, userId } = req.query;
        const CarTrackings = yield carTracking_1.default.find({ carId: carId, userId: userId });
        if (!CarTrackings) {
            res.status(400).json({ error: 'Cannot find this CarTracking' });
        }
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// put
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingCar = yield carTracking_1.default.findById(req.params.id);
        if (!existingCar) {
            res.status(404).json({ 'error': 'Car not found' });
            return;
        }
        existingCar.carId = req.body.carId || existingCar.carId;
        existingCar.notes = req.body.notes || existingCar.notes;
        const updatedOwner = yield existingCar.save();
        res.status(201).send(existingCar);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Delete 
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CarTrackingId = req.params.id;
    try {
        const deletedCarTracking = yield carTracking_1.default.findByIdAndDelete(CarTrackingId);
        if (!deletedCarTracking) {
            res.status(404).json({ error: 'CarTracking not found' });
            return;
        }
        res.status(200).json({ message: 'CarTracking deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting CarTracking:', err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=carTrackingRoute.js.map