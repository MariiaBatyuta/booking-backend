import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["Admin", "Owner"],
        default: "Admin",
    },
    token: {
        type: String,
        default: null,
    },
    payment: {
        lastFourDigits: { type: String },  
        cardType: { type: String },        
        cardExpiry: { type: String },     
        userName: { type: String },    
    }
    },
    {
        versionKey: false,
        Timestamp: true,
    }
);

export default mongoose.model("User", userSchema);