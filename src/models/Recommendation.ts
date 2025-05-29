import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
    {
      from: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
      },
     to: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true 
      },
     property: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Property", required: true 
        },
     createdAt: {
        type: Date,
        default: Date.now 
        }
    }
);

export default mongoose.model("Recommendation", recommendationSchema);
