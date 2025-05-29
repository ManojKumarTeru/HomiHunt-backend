import Favorite from "../models/Favorite";
import Property from "../models/Property";
import { Request, Response } from "express";

//adding property into favorite
export const addFavorite = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { propertyId } = req.body;

  try {
    const exists = await Favorite.findOne({ user: userId, property: propertyId });
    if (exists) return res.status(400).json({ message: "Already in favorites" });

    const fav = await Favorite.create({ user: userId, property: propertyId });
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to favorites", error: err });
  }
};

// geting all favorites for a user
export const getFavorites = async (req: Request, res: Response) => {
  const userId = req.user.id;
  // console.log(userId);

  try {
    const favorites = await Favorite.find({ user: userId });
    // console.log("favorites :", favorites);
    const propertyIds = favorites.map(f => f.property);
    const properties = await Property.find({ _id: { $in: propertyIds } });
    // console.log(properties);
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites", error: err });
  }
};

//removing properties from favorites
export const removeFavorite = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { propertyId } = req.params;

  try {
    await Favorite.findOneAndDelete({ user: userId, property: propertyId });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite", error: err });
  }
};
