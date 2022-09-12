import mongoose from "mongoose";

const Schema = mongoose.Schema;

const usedCupon = new Schema({
    user_id : {
        type: String,
        required: true,
        unique: true
    },
    cupon_id: {
        type: String,
        required: true,
        unique: true
    }
});

export const usedCuponModel = mongoose.model("usedCupon", usedCupon);