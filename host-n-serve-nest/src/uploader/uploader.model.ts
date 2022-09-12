import mongoose from "mongoose";

const Schema = mongoose.Schema;

const upload = new Schema({
    user_email: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    }
});

export const uploadModel = mongoose.model("upload", upload);