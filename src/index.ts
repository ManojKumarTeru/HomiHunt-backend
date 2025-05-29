import express from "express";
import dotenv from "dotenv";
import cors=require("cors");
import connectDB from "./config/database";
import propertyRoutes from "./routes/propertyRoutes"
import authRouter from "./controllers/authController";
import searchRouter from "./routes/propertySearchRoutes"
import cookieParser from "cookie-parser";
import favoriteRoutes from "./routes/favoriteRoutes"
import recommendationRoutes from "./routes/recommendationRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth",authRouter);
app.use("/properties",searchRouter);
app.use("/properties",propertyRoutes);
app.use("/favorites",favoriteRoutes);
app.use("/recommendations", recommendationRoutes);



// app.use("/",(req,res)=>res.send("Iam working now!"));

connectDB()
    .then(()=>{
        console.log("Database connection established..!!!");
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}!`);
        })
    })
    .catch(()=>{
        console.log("Database cannot be established..!");
    });

