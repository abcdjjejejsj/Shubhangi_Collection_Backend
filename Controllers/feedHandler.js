const feed=require("../Model/feedback");

const addFeed=async (req,res)=>{
    const body=req.body;
    console.log("bb :",body);
    try{
        const target=await feed.create({
            orderId:body.orderId,
            productName:body.productName,
            rating:body.rating,
            reviewText:body.reviewText,
            date:body.date
        })
        res.json({message:"Feedback submitted successfully"})
    }catch(err)
    {
        console.log("err :",err);
        res.json({error:err});
    }
}

const sendFeed=async (req,res)=>{
    try{
        const target=await feed.find();
        res.json(target);
    }catch(err)
    {
        res.json({error:err});
    }
}

module.exports={
    addFeed,
    sendFeed
}