import mongoose from "mongoose";
import validator from "validator";

const leadsSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    country_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("not valid email");
            }
        }
    },
    date: {
        type: Date,
        default: Date.now,
    },
    product_enquiry: {
        type: String,
        required: true,
        trim: true
    },
    segregation: {
        type: String,
        required: true,
        trim: true
    },
    datecreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date
    }
});


// Model
export default mongoose.model("leads", leadsSchema);
