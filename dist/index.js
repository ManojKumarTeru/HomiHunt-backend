"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const authController_1 = __importDefault(require("./controllers/authController"));
const propertySearchRoutes_1 = __importDefault(require("./routes/propertySearchRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "http://localhost:3000",
    "https://homi-hunt.vercel.app", // ✅ if you add a custom domain
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    console.log("Origin:", req.headers.origin); // 👈 log the real frontend origin
    next();
});
app.use("/auth", authController_1.default);
app.use("/properties", propertySearchRoutes_1.default);
app.use("/properties", propertyRoutes_1.default);
app.use("/favorites", favoriteRoutes_1.default);
app.use("/recommendations", recommendationRoutes_1.default);
// app.use("/",(req,res)=>res.send("Iam working now!"));
(0, database_1.default)()
    .then(() => {
    console.log("Database connection established..!!!");
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}!`);
    });
})
    .catch(() => {
    console.log("Database cannot be established..!");
});
