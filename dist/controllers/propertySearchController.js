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
exports.searchProperties = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const redis_1 = __importDefault(require("../config/redis"));
const searchProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city, colorTheme, state, priceMin, priceMax, bedrooms, bathroom, type, availableFor, furnished, listedBy, tags, amenities, listingType, isVerified, ratingMin, ratingMax } = req.query;
        //create a cache key from the query string
        const cacheKey = `search:${JSON.stringify(req.query)}`;
        //check Redis cache
        const cached = yield redis_1.default.get(cacheKey);
        if (cached) {
            console.log("⚡ Serving from Redis cache");
            return res.status(200).json(JSON.parse(cached));
        }
        //build MongoDB query
        const query = {};
        if (city)
            query.city = new RegExp(city.trim(), "i");
        if (colorTheme)
            query.colorTheme = new RegExp(colorTheme.trim(), "i");
        if (state)
            query.state = new RegExp(state.trim(), "i");
        if (type)
            query.type = new RegExp(type.trim(), "i");
        if (availableFor)
            query.availableFor = new RegExp(availableFor.trim(), "i");
        if (furnished)
            query.furnished = new RegExp(furnished.trim(), "i");
        if (listedBy)
            query.listedBy = new RegExp(listedBy.trim(), "i");
        if (listingType)
            query.listingType = new RegExp(listingType.trim(), "i");
        if (typeof isVerified === "string")
            query.isVerified = isVerified === "true";
        if (bedrooms)
            query.bedrooms = { $gte: parseInt(bedrooms) };
        if (bathroom)
            query.bathroom = { $gte: parseInt(bathroom) };
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin)
                query.price.$gte = parseInt(priceMin);
            if (priceMax)
                query.price.$lte = parseInt(priceMax);
        }
        if (ratingMin || ratingMax) {
            query.rating = {};
            if (ratingMin)
                query.rating.$gte = parseFloat(ratingMin);
            if (ratingMax)
                query.rating.$lte = parseFloat(ratingMax);
        }
        if (tags)
            query.tags = { $in: tags.split(",").map(tag => tag.trim()) };
        if (amenities)
            query.amenities = { $in: amenities.split(",").map(a => a.trim()) };
        console.log("Final Query:", query);
        //mongoDB call
        const properties = yield Property_1.default.find(query);
        //save result in Redis (TTL = 5 minutes)
        yield redis_1.default.set(cacheKey, JSON.stringify(properties), "EX", 300);
        res.status(200).json(properties);
    }
    catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: "Error during property search", error: err });
    }
});
exports.searchProperties = searchProperties;
