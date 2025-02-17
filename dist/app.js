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
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const carRoute_1 = __importDefault(require("./routes/carRoute"));
const carTrackingRoute_1 = __importDefault(require("./routes/carTrackingRoute"));
const ownerRoute_1 = __importDefault(require("./routes/ownerRoute"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
//Use JSON body parser before session
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Allow cookies
// MongoDB Connection
(0, connectDB_1.default)();
app.use((req, res, next) => {
    next();
});
// Define routes AFTER session middleware
app.use('/api/user', userRoute_1.default);
app.use('/api/car', carRoute_1.default);
app.use('/api/tracking', carTrackingRoute_1.default);
app.use('/api/owner', ownerRoute_1.default);
app.use('/api/log', logRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map