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
const car_1 = __importDefault(require("../../models/car"));
const carTracking_1 = __importDefault(require("../../models/carTracking"));
const router = (0, express_1.Router)();
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
//   // Get By ID 
//   router.get('/owner/:id', async (req: Request, res: Response) => {
//     try {
//       const Cars = await Car.find({'ownerId': req.params.id});
//       if(!Cars)
//       {
//         res.status(400).json({error: 'Cannot find this Car'});
//       }
//       res.status(200).send(Cars);
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   });
// Delete 
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(200).json({ message: 'Car deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting Car:', err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=%5Bid%5D.js.map