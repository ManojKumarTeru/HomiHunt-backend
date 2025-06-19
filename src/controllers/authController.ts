import express from "express";
import validateSignupData from "../utils/validation";
import bcrypt from "bcrypt";
import User from "../models/User";
import { authenticate } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
           const isProduction = (process.env.NODE_ENV || 'development') === 'production';

res.cookie("token", token, {
  expires: new Date(Date.now() + 7 * 24 * 3600000),
  httpOnly: true,
  sameSite: isProduction ? "None" : "Lax",
  secure: isProduction, // ✅ true only on production/HTTPS
});

            res.send("Login Successful! "+token);
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err: any) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req.body);

        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully!");
    } catch (err: any) {
        res.status(400).send("Error saving the user data: " + err.message);
    }
});

// GET /auth/me
authRouter.get("/me",authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select("emailId firstName lastName");
  res.json(user);
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production"
  });
  res.send("Logged out successfully");
});



export default authRouter;
