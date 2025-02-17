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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true, default: 'Admin' },
    password: { type: String, required: true },
});
// Pre-save middleware to hash password
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Only hash the password if it has been modified or is new
        if (!user.isModified('password')) {
            return next();
        }
        try {
            // Generate a salt
            const salt = yield bcrypt_1.default.genSalt(10);
            // Hash the password using the salt
            user.password = yield bcrypt_1.default.hash(user.password, salt);
            next(); // Proceed with save
        }
        catch (error) {
            next(error); // Pass error to the next middleware
        }
    });
});
// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user.js.map