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
const express_1 = __importDefault(require("express"));
const log_1 = __importDefault(require("../models/log"));
const router = express_1.default.Router();
// Get logs
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield log_1.default.find().sort({ timestamp: -1 });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving logs", error });
    }
}));
exports.default = router;
//# sourceMappingURL=logRoutes.js.map