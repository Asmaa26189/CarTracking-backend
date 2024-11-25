"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true, default: 'Admin' },
    password: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
