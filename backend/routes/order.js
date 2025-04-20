const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User, Order } = require("../db");
const { authMiddleware } = require("./middleware");
const { adminMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

//see all orders
router.get("/:userId", authMiddleware, async(req, res) => {

    const orders = await Order.find({
        userId : req.params.userId
    })

    res.json({
        order: orders.map(order => ({
            orderId: order._id,
            productId: order.porductId,
            categoryName: order.categoryName
        }))
    })
})

//place an order
router.post("/user/:userId/product/:productId", authMiddleware, async(req, res) => {
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
router.get("/:orderId", authMiddleware,  async(req, res) => {
    const orderId = req.params;
    
    const order = await Order.findOne({
        _id: orderId
    });
    res.json({
        order: order
    })
})

//update order status
router.post("/update/:orderId", adminMiddleware, async(req, res) => {
    const orderId = req.params.orderId
    await Product.updateOne(req.body, {
        orderId
    })

    res.json({
        msg: "Update Product"
    })
})
module.exports = router;