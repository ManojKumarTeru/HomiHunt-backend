"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateSignupData = (data) => {
    const { firstName, lastName, emailId, password } = data;
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
        throw new Error("Invalid email format.");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }
};
exports.default = validateSignupData;
