import express from "express";
import validateSignupData from "../utils/validation";
import bcrypt from "bcrypt";
import User from "../models/User";

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
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 3600000),
                httpOnly: true,
                sameSite: 'None',
                secure:true
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

export default authRouter;
