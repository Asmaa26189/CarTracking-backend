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
const owner_1 = __importDefault(require("../models/owner"));
const car_1 = __importDefault(require("../models/car"));
const logger_1 = require("../utils/logger");
const tokenAuth_1 = __importDefault(require("../middlewares/tokenAuth"));
const router = (0, express_1.Router)();
// post
router.post('/', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOwner = new owner_1.default(req.body);
        const savedOwner = yield newOwner.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "insert";
        const message = `${newOwner}`;
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${newOwner._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(201).send(savedOwner);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// put
router.put('/:id', tokenAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingOwner = yield owner_1.default.findById(req.params.id);
        if (!existingOwner) {
            res.status(404).json({ 'error': 'Owner not found' });
            return;
        }
        const message = `${existingOwner} `;
        existingOwner.name = req.body.name || existingOwner.name;
        existingOwner.phone = req.body.phone || existingOwner.phone;
        existingOwner.notes = req.body.notes || existingOwner.notes;
        const updatedOwner = yield existingOwner.save();
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "update";
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${existingOwner._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(201).send(existingOwner);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get all 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owners = yield owner_1.default.find({});
        res.status(200).send(owners);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Get By ID 
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owners = yield owner_1.default.findById(req.params.id);
        if (!owners) {
            res.status(400).json({ error: 'Cannot find this owner' });
        }
        res.status(200).send(owners);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// Delete 
router.delete('/:id', tokenAuth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = req.params.id;
    try {
        const isReferenced = yield car_1.default.exists({ ownerId: ownerId });
        if (isReferenced) {
            res.status(400).json({ error: 'Cannot delete ,it is referenced in other documents.', });
            return;
        }
        const deletedOwner = yield owner_1.default.findByIdAndDelete(ownerId);
        if (!deletedOwner) {
            res.status(404).json({ error: 'Owner not found' });
            return;
        }
        const decode = (0, logger_1.getTokenFromHeader)(req);
        // Log details
        const type = "delete";
        const message = `${deletedOwner}`;
        const userType = decode ? decode.type : 'Guest';
        const userId = decode ? decode.userId : '';
        const path = `/car/${deletedOwner._id}`;
        try {
            yield (0, logger_1.saveLog)(type, message, userType, userId, path);
        }
        catch (logError) {
            console.error("Failed to save log:", logError);
        }
        res.status(200).json({ message: 'Owner deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting owner:', err);
        next(err);
    }
}));
exports.default = router;
//# sourceMappingURL=ownerRoute.js.map