const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose");
const { User } = require("../db");
const { authMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const amountSchema = z .object({
    userId: z.string(),
    amount: z.number().min(1),
    to: z.string()
})

//set payment method
router.post("/checkout", async(req, res) => {
    
})

//for a api which handle money transfer
router.post("/webhook", authMiddleware, async(req, res) => {

    const {amount , to} = req.body;
    const {success} = amountSchema.safeParse(req.body);
    if(!success){
        return res.json({
            msg: "Invalid amount / user"
        })
    }
    const user = await User.findOne({_id: req.body.userId});
    if(!user || user.balance < amount ){
        return res.status(400).json({
            msg: "insufficient balance"
        })
    }
    const toAccount = await User.findOne({_id: to});
    if(!toAccount){
        return res.status(404).json({
            msg: 'Invalid user'
        })
    }
    await User.updateOne ({_id: req.body.userId},{$inc:{balance: -amount}});
    await User.updateOne({_id: to}, {$inc:{balance: amount}});
    res.json({
        status: true
    })

})
module.exports = router;