const AppointmentSchema = new Schema({
  service: { type: Types.ObjectId, ref: "Service", required: true },
  providerName: String, // embassy / medical center / MOFA etc.
  slotStart: { type: Date, required: true },
  slotEnd: { type: Date, required: true },
  maxCapacity: { type: Number, default: 1 }, // some slots can have multiple capacity
  bookedBy: [{ type: Types.ObjectId, ref: "User" }], // users who booked
  status: { type: String, enum: ["available", "booked", "cancelled", "completed"], default: "available" },
  metadata: Schema.Types.Mixed
}, { timestamps: true });


import mongoose from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  // The user for whom the appointment is
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Related service request (e.g., medical for work visa)
  serviceRequest: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true,
  },
  type: {
    type: String,
    enum: ['Embassy', 'MOFA', 'NAVTTC', 'Medical'],
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  notes: {
    type: String, // e.g., "Bring passport and 2 photos"
    trim: true,
  },
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;