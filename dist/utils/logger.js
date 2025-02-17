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
exports.getTokenFromHeader = exports.saveLog = void 0;
const log_1 = __importDefault(require("../models/log"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saveLog = (type_1, message_1, ...args_1) => __awaiter(void 0, [type_1, message_1, ...args_1], void 0, function* (type, message, userType = "Guest", userId, path) {
    try {
        const log = new log_1.default({ type, message, userType, userId, path });
        yield log.save();
        console.log("Log saved successfully:", log);
    }
    catch (error) {
        console.error(" Error saving log:", error);
    }
});
exports.saveLog = saveLog;
const getTokenFromHeader = (req) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Get token after 'Bearer'
    if (!token) {
        return null; // No token provided
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        return decoded; // Return decoded payload
    }
    catch (err) {
        console.error("Error verifying token:", err);
        return null; // Invalid token
    }
};
exports.getTokenFromHeader = getTokenFromHeader;
//# sourceMappingURL=logger.js.map