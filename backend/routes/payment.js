const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose");
const { User } = require("../db");
const { authMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

//set payment method
router.post("/checkout", authMiddleware, async(req, res) => {
    
})

//for a api which handle money transfer
router.post("/webhook", authMiddleware, async(req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount , to} = req.body;
    const {success} = amountSchema.safeParse(req.body);
    if(!success){
        return res.json({
            msg: "Invalid amount / user"
        })
    }
    const user = await User.findOne({userId: req.userId}).session(session);
    if(!user || user.balance < amount ){
        await session.abortTransaction();
        return res.status(400).json({
            msg: "insufficient balance"
        })
    }
    const toAccount = await User.findOne({userId: to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(404).json({
            msg: 'Invalid user'
        })
    }
    await Account.updateOne ({userId: req.userId},{$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc:{balance: amount}}).session(session);
    await session.commitTransaction();
    res.json({
        status: true
    })

})
module.exports = router;