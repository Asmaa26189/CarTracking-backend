"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var userRoute_1 = __importDefault(require("./routes/userRoute"));
var connectDB_1 = __importDefault(require("./connectDB"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT;
// Middleware
app.use(body_parser_1.default.json());
// MongoDB Connection
(0, connectDB_1.default)();
// Routes
app.use('/api', userRoute_1.default);
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
