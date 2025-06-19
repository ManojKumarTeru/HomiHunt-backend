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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"],
    },
    lastName: {
        type: String,
        minlength: [2, "Name must be at least 2 characters long"],
    },
    emailId: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please enter a valid email",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
}, { timestamps: true });
userSchema.methods.getJWT = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = yield jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return token;
    });
};
userSchema.methods.validatePassword = function (passwordGivenByUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const passwordHash = user.password;
        const isPasswordValid = yield bcrypt.compare(passwordGivenByUser, passwordHash);
        return isPasswordValid;
    });
};
exports.default = mongoose.model("User", userSchema);
