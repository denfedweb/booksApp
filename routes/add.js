const {Router} = require("express");
const Book = require("../models/book");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, (req, res)=>{
    res.render("add", {
        title: "Add book",
        isAddPage: true
    });
});

router.post("/", auth, async (req, res)=>{
    const book = new Book({
       title: req.body.title,
       price: req.body.price,
       image: req.body.image,
       userId: req.user
    });
    try {
        await book.save();
        res.redirect("/books");
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;
