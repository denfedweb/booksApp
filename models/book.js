const {Schema, model} = require("mongoose");

const bookSchema = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    image: String,
    userId: {
        type: Schema.Types.ObjectID,
        ref: "User"
    }
});

bookSchema.method("toClient", function () {
    const book = this.toObject();
    book.id = book._id
    delete book._id
    return book
})

module.exports = model('Book', bookSchema);
