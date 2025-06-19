import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://homi-hunt.vercel.app",            // ✅ if you add a custom domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  console.log("Origin:", req.headers.origin); // 👈 log the real frontend origin
  next();
});



app.use("/auth",authRouter);
app.use("/properties",searchRouter);
app.use("/properties",propertyRoutes);
app.use("/favorites",favoriteRoutes);
app.use("/recommendations", recommendationRoutes);



// app.use("/",(req,res)=>res.send("Iam working now!"));

connectDB()
    .then(()=>{
        console.log("Database connection established..!!!");
        app.listen(PORT, '0.0.0.0',()=>{
            console.log(`Server is running on port ${PORT}!`);
        })
    })
    .catch(()=>{
        console.log("Database cannot be established..!");
    });

