const {Router} = require("express");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const router = Router();

router.post("/add", async (req, res)=>{
    const book = await Book.getById(req.body.id);
    await Cart.add(book);
    res.redirect("/cart");
});

router.post('/remove', async (req, res)=>{
    await Cart.remove(req.body.id);
    res.redirect("/cart");
});

router.post("/toggle", async (req, res)=>{
    await Cart.toggle(req.body.id, req.body.count);
    await Cart.fullPrice();
    res.redirect("/cart");
});

router.get("/", async (req, res)=>{
   const cart = await Cart.fetch();
   res.render('cart', {
        title: "Cart",
        isCart: true,
        books: cart.books,
        price: cart.price
   });
});

module.exports = router;
