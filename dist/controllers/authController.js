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
const express_1 = __importDefault(require("express"));
const validation_1 = __importDefault(require("../utils/validation"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middlewares/auth");
const authRouter = express_1.default.Router();
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId, password } = req.body;
        const user = yield User_1.default.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = yield user.validatePassword(password);
        if (isPasswordValid) {
            const token = yield user.getJWT();
            const isProduction = (process.env.NODE_ENV || 'development') === 'production';
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 3600000),
                httpOnly: true,
                sameSite: isProduction ? "None" : "Lax",
                secure: isProduction, // ✅ true only on production/HTTPS
            });
            res.send("Login Successful! " + token);
        }
        else {
            throw new Error("Invalid Credentials");
        }
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}));
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validation_1.default)(req.body);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        yield user.save();
        res.send("User added successfully!");
    }
    catch (err) {
        res.status(400).send("Error saving the user data: " + err.message);
    }
}));
// GET /auth/me
authRouter.get("/me", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.user.id).select("emailId firstName lastName");
    res.json(user);
}));
authRouter.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.send("Logged out successfully");
});
exports.default = authRouter;
