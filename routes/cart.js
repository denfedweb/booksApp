const {Router} = require("express");
const Book = require("../models/book");
const auth = require("../middleware/auth");
// const userSession = require("../middleware/user");
const router = Router();

function mapCartItems(cart){
   return cart.items.map((b)=>({
        ...b.bookId._doc,
       count: b.count,
       id: b.bookId.id
    }))
}

function computePrice(books){
    return books.reduce((total, book)=>{
        return total += book.price * book.count;
    }, 0);
}

router.post("/add", auth, async (req, res)=>{
    const book = await Book.findById(req.body.id);
    await req.user.addToCart(book);
    res.redirect("/cart");
});

router.post('/remove', auth, async (req, res)=>{
    await req.user.removeCartBook(req.body.id);

    res.redirect("/cart");
});

router.post("/toggle", auth, async (req, res)=>{
    await req.user.toggle(req.body.id, req.body.count);

    res.redirect("/cart");
});

router.get("/", auth, async (req, res)=>{
    //method populate достает книги
    const user = await req.user
        .populate('cart.items.bookId')
        .execPopulate()
    const books = mapCartItems(user.cart);
    res.render('cart', {
         title: "Cart",
         isCart: true,
         books,
         price: computePrice(books)
    });
});

module.exports = router;
