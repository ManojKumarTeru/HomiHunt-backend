import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
      },
      property: { 
        type: String, required: true 
      },
      createdAt: { 
        type: Date, default: Date.now 
      }
    }
);

export default mongoose.model("Favorite", favoriteSchema);
