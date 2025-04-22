const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User, Order } = require("../db");
const { authMiddleware } = require("./middleware");
const { adminMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const orderSchema = z.object({
    orderId: z.string().optional(),
    userId: z.string(),
    status: z.string().optional()
})

//update order status
router.post("/update/", async(req, res) => {
    const orderId = req.body.orderId;
    await Order.updateOne( {
        _id: orderId
    },
    {$set:{status: req.body.status}})

    res.json({
        msg: "Update Product"
    })
})

//see all orders
router.get("/cart", async(req, res) => {
    const body = req.body;
    const {success} = orderSchema.safeParse(req.body);
    if(!success) {
        res.json({
            msg:"wrong body"
        })
    }
    const orders = await Order.find({
        userId : body.userId
    })

    res.json({
        order: orders.map(order => ({
            orderId: order._id,
            productId: order.porductId,
            status: order.status
        }))
    })
})

//place an order
router.post("/user/:userId/product/:productId",  async(req, res) => {
    const {userId, productId} = req.params;
    const status = req.body.status;

    const dbOrder = await Order.create({
        userId: userId,
        productId: productId,
        status: status
    })
    res.json({
        userId,
        productId,
        status
    })
})

//get specific order
router.get("/one",  async(req, res) => {
    const orderId = req.body.orderId;
    const {success} = orderSchema.safeParse(req.body);
    if(!success){
        return res.json({
            msg: "wrong body"
        })
    }
    const order = await Order.findOne({
        _id: orderId
    });
    console.log(order);
    res.json({
        order: order
    })
})

module.exports = router;