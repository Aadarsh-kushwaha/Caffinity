const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [{
        productId: Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],

    customer: {

        fullName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        tableNumber: Number,

        instructions: String
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "payment_pending",
            "paid",
            "preparing",
            "completed",
            "cancelled"
        ],
        default: "payment_pending"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);