import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Property from "../models/Property";
import dotenv from "dotenv";


dotenv.config();

// connecting to MongoDB here
mongoose.connect(process.env.MONGO_URL || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => {
    console.log("MongoDB connected");
    importCSV(); // we are importing after DB connection
  })
  .catch(err => console.error("MongoDB connection error", err));



// fuunction to import CSV
function importCSV() {
  const results: any[] = [];

  fs.createReadStream(path.resolve(__dirname, "../../data.csv"))
    .pipe(csv())
    .on("data", (data) => {
        data.isVerified = data.isVerified?.toLowerCase() === "true";
        results.push(data)
    })
    .on("end", async () => {
      try {
        await Property.insertMany(results);
        console.log("CSV data successfully imported!");
        process.exit(); // exit script
      } catch (error) {
        console.error("Error inserting data:", error);
        process.exit(1);
      }
    });
}
