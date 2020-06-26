const {Router} = require("express");
const Book = require("../models/book");
const User = require("../models/user");
const auth = require("../middleware/auth");
const clearCache = require("../services/cache");
const router = Router();

router.get("/", async (req, res)=>{
    const books = await Book.find()
        .populate("userId", "email name");

    res.render("books", {
        title: "Books",
        isBooks: true,
        books
    });
});

router.get("/:id/edit", auth, async (req, res)=>{
    if(!req.query.allow){
       return res.redirect("/");
    }

    const book = await Book.findById(req.params.id);

    res.render("edit", {
        title: `Edit ${book.title}`,
        book
    })
});

router.post("/edit", auth, async (req, res)=>{
    try{
        const {id} = req.body
        delete req.body.id
        await Book.findByIdAndUpdate(id, req.body);
        res.redirect("/books");
    } catch (e) {
        console.error(e);
    }
});

router.post("/remove", auth, async (req, res)=>{
    try{
        await Book.deleteOne({
            _id: req.body.id
        });
        const users = await User.find();
        await users.forEach((user)=>{
            user.removeCartBook(req.body.id);
        });

        res.redirect("/books");
    } catch (e) {
        console.error(e)
    }
});

router.get("/:id", async (req, res)=>{
    //есть баг - при невалидном src картинки req.params.id присылается повторно с src картнки
    try{
        const book = await Book.findById(req.params.id).cache(req.params.id);
        res.render('book', {
            layout: "empty",
            title: `Book ${book.title}`,
            book
        });
    } catch (e) {
        res.redirect("/books");
        console.error(e);
    }
});

module.exports = router;
