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
        const CarTrackings = yield carTracking_1.default.find({});
        res.status(200).send(CarTrackings);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map