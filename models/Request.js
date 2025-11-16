const RequestSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, index: true },
  service: { type: Types.ObjectId, ref: "Service", required: true },
  // dynamic form fields saved here (passport number, dates...), keep flexible
  formData: { type: Schema.Types.Mixed, default: {} },

  // attached documents
  documents: [DocumentSchema],

  status: { type: String, enum:  ["draft", "pending", "processing", "completed", "rejected", "cancelled"], default: "draft", index: true },

  // assignment & processing
  assignedTo: { type: Types.ObjectId, ref: "User" }, // operator/admin
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

  // history of status changes & admin comments
  history: [{
    fromStatus: String,
    toStatus: String,
    changedBy: { type: Types.ObjectId, ref: "User" },
    comment: String,
    at: { type: Date, default: Date.now }
  }],

  // final files generated (ticket PDF, visa copy etc.)
  outputs: [{
    label: String,
    url: String,
    uploadedAt: Date,
    uploadedBy: { type: Types.ObjectId, ref: "User" }
  }],

  // optional fields for audit
  estimatedCompletionDate: Date,
  completedAt: Date,
  rejectedReason: String
}, { timestamps: true });







import mongoose from 'mongoose';
const { Schema } = mongoose;

// Sub-schema for uploaded documents
const documentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String, // This would be the secure URL from Cloudinary/S3
    required: true,
  },
  fileType: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Sub-schema for internal notes or comments
const noteSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Sub-schema for tracking status changes
const statusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const serviceRequestSchema = new Schema({
  // The user who submitted the request
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The service being requested
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  // The admin or operator handling this case
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Requires Action', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  // Flexible storage for the multi-step form data
  formData: {
    type: Map,
    of: String,
  },
  // Documents uploaded by the user
  userDocuments: [documentSchema],
  // Documents uploaded by the admin (e.g., ticket, visa copy)
  adminDocuments: [documentSchema],
  // Internal notes for admin/operator
  internalNotes: [noteSchema],
  // A log of all status changes
  statusHistory: [statusHistorySchema],
}, {
  timestamps: true,
});

// Automatically add initial status to history when created
serviceRequestSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.user, // Or a system ID if preferred
      timestamp: new Date()
    });
  }
  next();
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;