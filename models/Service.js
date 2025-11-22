import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      unique: true,
      trim: true,
    },
    imageURL: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },

      formFields: [
    {
      label: String,     // shown on UI
      name: String,      // used as key in formData
      type: String,      // text | number | date | select | file
      required: Boolean,
      options: [String], // optional
    }
  ],
  
    // List of document names the user needs to upload
    requiredDocuments: {
      type: [String],
      default: [],
    },
    // Informational field for the user
    estimatedProcessingSteps: {
      type: [String],
      default: [],
    },
    estimatedProcessingDays: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
