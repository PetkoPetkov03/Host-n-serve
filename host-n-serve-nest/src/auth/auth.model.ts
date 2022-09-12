import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const auth = new Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    hashed_PWD: {
        type: String,
        required: true
    },
    stripe_customer_id: {
        type: String,
        required: true
    }
});

export const authModel = mongoose.model("auth", auth);