"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const tokenAuth = (req, res, next) => {
    try {
        // add token in middleware to use it any where in handlers
        const tokenSecret = process.env.TOKEN_SECRET;
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
        req.body.user = decoded;
        return next();
    }
    catch (err) {
        res.status(401);
        res.json('Access denied, invalid token');
    }
};
exports.default = tokenAuth;
//# sourceMappingURL=tokenAuth.js.map