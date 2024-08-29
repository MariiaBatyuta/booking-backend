import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: null,
    }
    },
    {
        versionKey: false,
        Timestamp: true,
    }
);

export default mongoose.model("User", userSchema);