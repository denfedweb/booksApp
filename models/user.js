const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                bookId: {
                    type: Schema.Types.ObjectID,
                    ref: 'Book',
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(book) {
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex((b)=> {
       return b.bookId.toString() === book._id.toString()
    });

    if(idx >= 0){
        clonedItems[idx].count += 1;
    } else {
        clonedItems.push({
            bookId: book._id,
            count: 1
        });
    }

    this.cart = {items: clonedItems};
    return this.save()
}

userSchema.methods.removeCartBook = function(id){
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex((b)=> {
        return b.bookId.toString() === id.toString()
    });
    delete clonedItems[idx];
    this.cart = {items: clonedItems};
    return this.save()
}

userSchema.methods.toggle = function(id, newCount){
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex((b)=> {
        return b.bookId.toString() === id.toString()
    });
    clonedItems[idx].count = newCount;
    this.cart = {items: clonedItems};
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save()
};

module.exports = model("User", userSchema);
