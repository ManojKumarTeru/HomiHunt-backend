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
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const Property_1 = __importDefault(require("../models/Property"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// connecting to MongoDB here
mongoose_1.default.connect(process.env.MONGO_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("MongoDB connected");
    importCSV(); // we are importing after DB connection
})
    .catch(err => console.error("MongoDB connection error", err));
// fuunction to import CSV
function importCSV() {
    const results = [];
    fs_1.default.createReadStream(path_1.default.resolve(__dirname, "../../data.csv"))
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        var _a;
        data.isVerified = ((_a = data.isVerified) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "true";
        results.push(data);
    })
        .on("end", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield Property_1.default.insertMany(results);
            console.log("CSV data successfully imported!");
            process.exit(); // exit script
        }
        catch (error) {
            console.error("Error inserting data:", error);
            process.exit(1);
        }
    }));
}
