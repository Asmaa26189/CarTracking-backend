"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OwnerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Owner', OwnerSchema);
//# sourceMappingURL=owner.js.map