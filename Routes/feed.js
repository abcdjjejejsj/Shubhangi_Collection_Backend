const category=require("../Model/feedback");
const express=require('express');
const handler=require("../Controllers/feedHandler");
const router=express.Router();

router.post("/addFeed",handler.addFeed);

router.get("/sendFeed",handler.sendFeed);



module.exports=router;