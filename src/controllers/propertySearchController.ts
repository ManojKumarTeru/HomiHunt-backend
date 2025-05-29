import { Request, Response } from "express";
import Property from "../models/Property";
import redis from "../config/redis";

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const {
      city,
      colorTheme,
      state,
      priceMin,
      priceMax,
      bedrooms,
      bathroom,
      type,
      availableFor,
      furnished,
      listedBy,
      tags,
      amenities,
      listingType,
      isVerified,
      ratingMin,
      ratingMax
    } = req.query;

    //create a cache key from the query string
    const cacheKey = `search:${JSON.stringify(req.query)}`;

    //check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Serving from Redis cache");
      return res.status(200).json(JSON.parse(cached));
    }

    //build MongoDB query
    const query: any = {};

    if (city) query.city = new RegExp((city as string).trim(), "i");
    if (colorTheme) query.colorTheme = new RegExp((colorTheme as string).trim(), "i");
    if (state) query.state = new RegExp((state as string).trim(), "i");
    if (type) query.type = new RegExp((type as string).trim(), "i");
    if (availableFor) query.availableFor = new RegExp((availableFor as string).trim(), "i");
    if (furnished) query.furnished = new RegExp((furnished as string).trim(), "i");
    if (listedBy) query.listedBy = new RegExp((listedBy as string).trim(), "i");
    if (listingType) query.listingType = new RegExp((listingType as string).trim(), "i");

    if (typeof isVerified === "string") query.isVerified = isVerified === "true";

    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms as string) };
    if (bathroom) query.bathroom = { $gte: parseInt(bathroom as string) };

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseInt(priceMin as string);
      if (priceMax) query.price.$lte = parseInt(priceMax as string);
    }

    if (ratingMin || ratingMax) {
      query.rating = {};
      if (ratingMin) query.rating.$gte = parseFloat(ratingMin as string);
      if (ratingMax) query.rating.$lte = parseFloat(ratingMax as string);
    }

    if (tags) query.tags = { $in: (tags as string).split(",").map(tag => tag.trim()) };
    if (amenities) query.amenities = { $in: (amenities as string).split(",").map(a => a.trim()) };

    console.log("Final Query:", query);

    //mongoDB call
    const properties = await Property.find(query);

    //save result in Redis (TTL = 5 minutes)
    await redis.set(cacheKey, JSON.stringify(properties), "EX", 300);

    res.status(200).json(properties);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Error during property search", error: err });
  }
};
