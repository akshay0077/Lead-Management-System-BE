import mongoose from "mongoose";
import validator from "validator";

const leadsSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  country_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("not valid email");
      }
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  product_enquiry: {
    type: String,
    required: true,
    trim: true,
  },
  segregation: {
    type: String,
    required: true,
    enum: ["REPAIRS", "TRADERS"],
  },
  datecreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
  },
});

// Middleware to update the dateUpdated field before save
leadsSchema.pre("save", function (next) {
  this.dateUpdated = new Date();
  next();
});

// Model
export default mongoose.model("leads", leadsSchema);
