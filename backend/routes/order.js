const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User, Order } = require("../db");
const { authMiddleware } = require("./middleware");
const { adminMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const orderSchema = z.object({
    status: z.string().optional()
})

//see all orders
router.get("/cart",authMiddleware, async(req, res) => {
    const body = req.body;
    const {success} = orderSchema.safeParse(req.body);
    if(!success) {
        res.json({
            msg:"wrong body"
        })
    }
    const orders = await Order.find({
        userId : req.userId
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
router.post("/place/:productId",authMiddleware,  async(req, res) => {
    const {productId} = req.params;
    const status = req.body.status;
    const userId = req.userId;

    const dbOrder = await Order.create({
        userId: userId,
        productId: productId
    })
    res.json({
        order: dbOrder
    })
})

//update order status
router.post("/update/:orderId",adminMiddleware, async(req, res) => {
    const {orderId} = req.params;
    await Order.updateOne( {
        _id: orderId
    },
    {$set:{status: req.body.status}})

    res.json({
        msg: "Update Product"
    })
})

//get specific order
router.get("/:orderId", authMiddleware,  async(req, res) => {
    const {orderId} = req.params;
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