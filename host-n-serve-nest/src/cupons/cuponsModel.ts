import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cupons = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    cupon_id: {
        type: String,
        required: true,
        unique: true
    }
})

export const cuponsModel = mongoose.model("cupons", cupons);