import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const payments = new Schema({
    price: {
        type: Number,
        required: true
    },
    subscription_id: {
        type: String,
        required: true
    }
});

export const paymentsModel = mongoose.model("payments", payments);