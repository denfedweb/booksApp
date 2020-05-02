const {Router} = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res)=>{
    try{
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate("user.userId")
        res.render("orders", {
            isOrder: true,
            title: 'You orders:',
            orders: orders.map(o =>({
               ...o._doc,
               price: o.books.reduce((total, b)=>{
                   return total += b.count * b.book.price
               }, 0)
            }))
        })
    } catch (e) {
        console.log(e);
    }
});

router.post("/", auth, async (req, res)=>{
    try{
        const user = await req.user
            .populate("cart.items.bookId")
            .execPopulate()
        const books = user.cart.items.map(i => ({
            count: i.count,
            book: {...i.bookId._doc}
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                email: req.user.email,
                userId: req.user
            },
            books
        })
        await order.save()
        await req.user.clearCart()
        res.redirect("/orders");
    } catch(e){
        console.log(e);
    }
});

module.exports = router;
