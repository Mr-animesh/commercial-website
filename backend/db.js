const mongoose = require('mongoose');
const { type } = require('os');

mongoose.connect("mongodb://localhost:27017/artstore")
//mongodb://localhost:27017/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 8
    },
    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 30
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    }

});

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: String,
        default: 1
    },
    categoryName: {
        type: String,
        required: true
    },
    booked: {
        type: Boolean,
        required: true,
        default: false
    }
});

const prdCategorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})

const categorySchema= new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: "pending",
    }
});

const orderPurchasedSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
});

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    method: {
        type: String,
        enum: ['upi', 'cash'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'completed'],
        default : 'pending'
    }
});

const productImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    alternateTxt: {
        type: String,
        required: true,
        default: 'Image'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
});


const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderPurchased = mongoose.model('OrderPurchased', orderPurchasedSchema)
const Payment = mongoose.model('Payment', paymentSchema)
const Category = mongoose.model('Category', categorySchema)
const ProductImage = mongoose.model('ProductImage', productImageSchema)
const PrdCategory = mongoose.model('ProductCategory',prdCategorySchema)

module.exports = {
    User,
    Product,
    Order,
    OrderPurchased,
    Payment,
    Category,
    ProductImage,
    PrdCategory
}