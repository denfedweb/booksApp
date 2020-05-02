const {Router} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = Router();

router.get("/login", (req, res)=>{

    res.render("auth/login", {
        title: "Auth",
        isLogin: true,
        error: req.flash("error")
    })
});

router.get("/logout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/auth/login");
    });
});

router.post("/login", async (req, res)=>{
    try {
        const {login_email, login_password} = req.body;
        const candidate = await User.findOne({email: login_email});

        if(candidate){
            const areSame = await bcrypt.compare(login_password, candidate.password);

            if(areSame){
                const user = candidate;
                req.session.user = user;
                req.session.isAuth = true;
                req.session.save(err=>{
                    if(err){
                        throw err
                    }
                    res.redirect("/");
                });
            } else {
                req.flash("error", "Password not valid!");
                res.redirect("/auth/login");
            }
        }else{
            req.flash("error", "User not found!");
            res.redirect("/auth/login");
        }

    }catch (e) {
        console.log(e)
    }
});

router.post("/register", async function(req, res){
    try{
        const {register_email, register_name, register_password, repeat} = req.body;
        const candidate = await User.findOne({email: register_email});
        if(candidate){
            req.flash("error", "User with this email already exists!");
            res.redirect("/auth/login");
        } else {
            const hashPass = await bcrypt.hash(register_password, 10)
            const user = new User({
                email: register_email,
                name: register_name,
                password: hashPass,
                cart: {items: []}
            });
            await user.save();
            res.redirect("/auth/login");
        }
    }catch (e) {
        console.log(e);
    }
});

module.exports = router;
