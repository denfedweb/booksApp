const express = require("express");
const util = require('util');
const Handlebars = require('handlebars')
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const helpers = require('handlebars-helpers')();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const redis = require("redis");
const csrf = require("csurf");
const flash = require("connect-flash");
const homeRoutes = require("./routes/home");
const booksRoutes = require("./routes/books");
const cartRoutes = require("./routes/cart");
const addBooksRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const path = require("path");
const varMiddleware = require("./middleware/variables");
const userSession = require("./middleware/user");
const keys = require("./keys/index");

//mongodb url to connect and any variables
const {MONGODB_URI, SESSION_SECRET} = keys;

const app = express();

//hbs
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers
});

//session
const store = new MongoStore({
   collection: "sessions",
   uri: MONGODB_URI,
});

//use hbs
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
//name of templates
app.set("views", "views");

//static files path
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));

//session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

//csrf protection
app.use(csrf());

//middlewares
app.use(varMiddleware);
app.use(userSession);
//errors form handler
app.use(flash());

//routes
app.use("/", homeRoutes);
app.use("/books", booksRoutes);
app.use("/cart", cartRoutes);
app.use("/add", addBooksRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
    try{
        //connect to mongodb
        await mongoose.connect(MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
                );
        app.listen(PORT, ()=>{
            console.log("server started on port:", PORT);
        });
    } catch (e) {
        console.error(e);
    }
}
//start server
start();



