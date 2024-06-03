import mongoose from "mongoose";
const { Schema } = mongoose;

const patientRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    patientName: {
      type: String,
      required: true,
      minlength: 3,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    doctorName: {
      type: String,
      required: true,
      minlength: 3,
    },
    labName: {
      type: String,
      required: true,
      minlength: 3,
    },
    testType: {
      type: String,
      required: true,
    },
    barcodeNumber: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    dateOfVisit: {
      type: Date,
      required: true,
    },
    dateOfReport: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);
export default PatientRecord;
