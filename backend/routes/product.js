const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User, Product, PrdCategory, Category } = require("../db");
const { authMiddleware } = require("./middleware");
const { adminMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const productSchema = z.object({
    productName: z.string(),
    stock: z.string(),
    price: z.number(),
    categoryName: z.string(),
    booked: z.boolean().optional()
})

//to get all products from db
router.get("/bulk",  async(req, res) => {
    const filter = req.query.filter || "";  

    const products = await Product.find({
        $or:[{
            productName: {
                "$regex": filter
            }
        }]
    })
    res.json({
        product: products.map(product => ({
            productName: product.productName,
            categoryName: product.categoryName,
            price: product.price,
            stock: product.stock,
            booked: product.booked
        }))
    })
})

// get all product which are from same category frm db
router.get("/categorie",  async(req, res) => {
    const categoryName = req.body.categoryName

    const category = await Category.findOne({ categoryName: categoryName })
    const prdCategory = await PrdCategory.find({ categoryId: category._id }) //array
    const productIds = prdCategory.map(p => p.productId)

  // Query for any document whose _id is in that list:
    const products = await Product.find({
        _id: { $in: productIds }
    });


    res.json({
        product: products.map(product => ({
            productName: product.productName,
            categoryName: product.categoryName,
            stock: product.stock,
            price: product.price,
            booked: product.booked,
            _id: product._id
        }))
    })
})

//add a prduct in db
router.post("/add",  async(req, res) => {
    try{    const body = req.body;
        const {success} = productSchema.safeParse(req.body)
        if(!success) {
            return res.status(404).json({
                msg: "Incorrect Product"
            })
        }
    
        const product = await Product.findOne({
            productName: body.productName
        });
    
        if(product?._id) {
            return res.json({
                msg: "product already exist"
            })
        }
        const dbProduct = await Product.create(body);
        const productId = dbProduct._id;
    
        // updating another table in same request
        const categoryName = dbProduct.categoryName;
        let category = await Category.findOne({
            categoryName: body.categoryName
        })
        console.log(category)
        let categoryId;
        if(category?._id ){
            categoryId = category._id;
        }else{
            const newCategory = await Category.create({categoryName});
            categoryId = newCategory._id;
        }
        await PrdCategory.create({
            productId,
            categoryId
        })
        res.status(201).json({
            success: true,
            productId,
            categoryId
        })}
        catch(e) {
            console.error("Error adding product", e);
            res.status(500).json({
                success: false,
                msg: "Failed to add product",
                e: e.msg
            })
        }
    })

//to get a particular prd acc to id from db
router.get("/:id",  async(req, res) => {
    const productId = req.params.id
    const product = await Product.findOne({
        _id: productId
    })
    res.json({product: product})
})


//update a product in db by id
router.put("/add/:id", async(req, res) => {
    const productId = req.params.id
    console.log(productId)
    const product = await Product.updateOne( {
        _id: productId
    }, req.body)

    res.json({
        msg: "Update Product",
        product: product
    })
})




module.exports = router;