const express = require("express");
const exphbs = require("express-handlebars");
const helpers = require('handlebars-helpers')();
const homeRoutes = require("./routes/home");
const booksRoutes = require("./routes/books");
const cartRoutes = require("./routes/cart");
const addBooksRoutes = require("./routes/add");
const path = require("path");

const app = express();

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set("views", "views");
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));

app.use("/", homeRoutes);
app.use("/books", booksRoutes);
app.use("/cart", cartRoutes);
app.use("/add", addBooksRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log("server started on port:", PORT);
});



