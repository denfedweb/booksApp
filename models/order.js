const {Schema, model} = require("mongoose");

const orderSchema = new Schema({
    books: [{
        book: {
            type: Object,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }],
    user: {
        name: String,
        email: String,
        userId: {
            type: Schema.Types.ObjectID,
            ref: "User",
            required: true
        },
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model("Order", orderSchema);
