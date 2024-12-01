"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connectDB_1 = __importDefault(require("./connectDB"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Middleware
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// MongoDB Connection
(0, connectDB_1.default)();
// Routes
app.use('/api/user', require('./routes/user').default);
app.use('/api/car', require('./routes/car').default);
app.use('/api/tracking', require('./routes/carTracking').default);
app.use('/api/owner', require('./routes/owner').default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map