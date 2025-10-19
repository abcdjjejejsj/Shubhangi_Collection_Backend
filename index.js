require("dotenv").config();   

const express=require("express");
const path=require("path");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const route=require("./Routes/userRoutes");
const product_route=require("./Routes/productRoute");
const categoryRoute=require("./Routes/categoryRoute");
const dashboardRoute=require("./Routes/dashboard");
const beauty=require("./Routes/appointmentBeauty");
const cartRoute=require("./Routes/cart");
const wishRoute=require("./Routes/wishRoute");
const orderRoutes = require("./Routes/orderRoutes");
const del=require("./Routes/boy");
const web=require("./Routes/websiteManager");
const feed=require("./Routes/feed");

const app=express();

const sec = process.env.secret_key;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const loadDataRoute = require("./Routes/loadData");
app.use("/api/loadData", loadDataRoute);

function validateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/register");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        console.log("password :",user.password)
        next();
    });
}


function validateAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/register");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.admin_email)
        {

            next();
        }else{
            // res.send("access forbidden !");
            res.redirect("/register");
        }
    });
}

function validateDeliveryBoy(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/register");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.delivery_email)
        {

            next();
        }else{
            // res.send("access forbidden !");
            res.redirect("/register");
        }
    });
}

app.get("/heartbit",(req,res)=>{
    res.send("backend is ready");
})

app.get("/admin.html",validateAdmin,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `admin.html`));
    // res.send("admin page");
})

app.get("/order.html",validateUser,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `order.html`));
})

app.get("/cart.html",validateUser,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `cart.html`));
})

app.get("/delivery.html",validateUser,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `delivery.html`));
})

app.get("/wishlist.html",validateUser,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `wishlist.html`));
})

app.get("/profile.html",validateUser,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `profile.html`));
})

app.get("/ddelivery.html",validateDeliveryBoy,(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Collection', `ddelivery.html`));
})

app.use(express.static(path.join(__dirname, '..','Collection')));


app.get("/validateUser",validateUser,(req,res)=>{
    res.send("success");
})

app.get("/admin",(req,res)=>{
    res.redirect("/admin.html");
})


app.use("/api",route);

app.use("/product",product_route);

app.use("/category",categoryRoute);

app.use("/dashboard",dashboardRoute);

app.use("/parlor",beauty);

app.use("/cart",cartRoute);

app.use("/wish",wishRoute);

app.use("/order", orderRoutes);

app.use("/deliveryBoy",del);

app.use("/website-content",web);

app.use("/feedback",feed);



app.get('/:page', (req, res) => {
    console.log("hello world");
    if(req.params.page=="order")
    {
        res.redirect("/order.html");
    }else if(req.params.page=="cart")
    {
        res.redirect("/cart.html");
    }else if(req.params.page=="wishlist")
    {
        res.redirect("/wishlist.html");
    }else if(req.params.page=="delivery")
    {
        res.redirect("/delivery.html");
    }else if(req.params.page=="profile")
    {
        res.redirect("/profile.html");
    }else if(req.params.page=="ddelivery")
    {
        res.redirect("/ddelivery.html");
    }else{
        res.sendFile(path.join(__dirname, '..', 'Collection', `${req.params.page}.html`));
    }
    // console.log("page :: ",req.params.page);
    if (req.params.page.includes('.'))
        {
            return res.status(404).send('Not found');
        } 

    
});

app.listen(3400,()=>{
    console.log("Server started at 3400");
})