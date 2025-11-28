import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["passport", "photo", "ticket", "mofa", "other", "image/png"],
      default: "other",
    },
    filename: String,
    uri: { type: String, required: true },
    provider: { type: String }, // "cloudinary" | "s3"
    publicId: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

export default DocumentSchema;
