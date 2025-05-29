import { Request, Response } from "express";
import Property from "../models/Property";

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = new Property({
      ...req.body,
      createdBy: req.user?.id,
    });

    await property.save();
    res.status(201).json("Property created successfully!",property);
  } catch (err) {
    res.status(500).json({ message: "Failed to create property", error: err });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving property", error: err });
  }
};


export const getMyProperties = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User ID missing." });
    }

    const properties = await Property.find({ createdBy: userId });

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this user" });
    }

    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user-specific properties", error: err });
  }
};



export const getAllProperties = async (req: Request, res: Response) => {
  try {
    // fetch properties where createdBy is the logged-in user's ID
    const properties = await Property.find({});

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this user" });
    }

    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching properties", error: err });
  }
};


export const updateProperty = async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });

  if (property.createdBy.toString() !== req.user?.id)
    return res.status(403).json({ message: "Not authorized to update this property" });

  Object.assign(property, req.body);
  await property.save();

  res.status(200).json("Property updated successfully!",property);
};

export const deleteProperty = async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });

  if (property.createdBy.toString() !== req.user?.id)
    return res.status(403).json({ message: "Not authorized to delete this property" });

  await property.deleteOne();
  res.status(200).json({ message: "Property deleted" });
};
