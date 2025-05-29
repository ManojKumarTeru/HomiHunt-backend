import { Request, Response } from "express";
import Recommendation from "../models/Recommendation";
import User from "../models/User";
import Property from "../models/Property";

// recommend a property to another user by email
export const recommendProperty = async (req: Request, res: Response) => {
  const fromUserId = req.user.id;
  const { recipientEmail, propertyId } = req.body;

  try {
    const toUser = await User.findOne({ emailId: recipientEmail });
    if (!toUser) return res.status(404).json({ message: "Recipient user not found" });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const alreadyRecommended = await Recommendation.findOne({
      from: fromUserId,
      to: toUser._id,
      property: property._id
    });
    if (alreadyRecommended) {
      return res.status(400).json({ message: "You already recommended this property to this user" });
    }

    const recommendation = await Recommendation.create({
      from: fromUserId,
      to: toUser._id,
      property: property._id
    });

    res.status(201).json({ message: "Property recommended successfully", recommendation });
  } catch (err) {
    res.status(500).json({ message: "Failed to recommend property", error: err });
  }
};

// get all recommendations received
export const getReceivedRecommendations = async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const recommendations = await Recommendation.find({ to: userId })
      .populate("from", "name email")
      .populate("property");

    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recommendations", error: err });
  }
};
