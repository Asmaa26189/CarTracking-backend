"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var OwnerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Owner', OwnerSchema);
