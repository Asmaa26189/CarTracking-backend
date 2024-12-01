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
const carTracking_1 = __importDefault(require("../../models/carTracking"));
const router = (0, express_1.Router)();
// Get By ID 
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CarTrackings = yield carTracking_1.default.findById(req.params.id);
        if (!CarTrackings) {
            res.status(400).json({ error: 'Cannot find this CarTracking' });
        }
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//   // Get By USERID 
//   router.get('/user/:id', async (req: Request, res: Response) => {
//       try {
//         const CarTrackings = await CarTracking.find({userId:req.params.id});
//         if(!CarTrackings)
//         {
//           res.status(400).json({error: 'Cannot find this CarTracking'});
//         }
//         res.status(200).send(CarTrackings);
//       } catch (err) {
//         res.status(500).send(err);
//       }
//     });
//   // Get By CARID 
//   router.get('/car/:id', async (req: Request, res: Response) => {
//       try {
//         const CarTrackings = await CarTracking.find({carId:req.params.id});
//         if(!CarTrackings)
//         {
//           res.status(400).json({error: 'Cannot find this CarTracking'});
//         }
//         res.status(200).send(CarTrackings);
//       } catch (err) {
//         res.status(500).send(err);
//       }
//     });
//   // Get By USERID & CARID
//   router.get('/carUser', async (req: Request, res: Response) => {
//       try {
//           const { carId, userId } = req.query;
//         const CarTrackings = await CarTracking.find({carId:carId, userId:userId});
//         if(!CarTrackings)
//         {
//           res.status(400).json({error: 'Cannot find this CarTracking'});
//         }
//         res.status(200).send(CarTrackings);
//       } catch (err) {
//         res.status(500).send(err);
//       }
//     });
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
//# sourceMappingURL=%5Bid%5D.js.map