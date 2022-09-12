import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activeSubs = new Schema({
    subscription_id: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    }
});

export const activeSubsModel = mongoose.model("activeSubs", activeSubs);