const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User } = require("../db");
const { authMiddleware, adminMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const signupSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    isAdmin: z.boolean().optional()
})

const signinSchema = z.object({
    username: z.string(),
	password: z.string()
})

const updateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional()
})

//register a new user
router.post("/signup", async (req, res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            msg: "email already exist"
        })
    }
    const user = User.findOne({
        username: body.username
    })
    if(user._id){
        return res.json({
            msg: "email/user already exist"
        })
    }

    const dbUser = await User.create(body);
    const userId = dbUser._id;
    const isAdmin = dbUser.isAdmin;

    //to give balance to user
    await User.updateOne({_id: userId}, 
        {$set: {balance: 1 + Math.random()*1000}}
    )
    
    
    const token = jwt.sign({
        userId,
        isAdmin
    }, JWT_SECRET);

    res.json({
        token: token
    })
})


//signin already registered user
router.post("/signin", async (req, res) => {
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(404).json({
            msg: "error while singin"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id,
            isAdmin: user.isAdmin
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        msg: "Error while logging in"
    })
})    

//update user 
router.put("/",authMiddleware, async(req, res)=>{
    const {field, value} = req.body;
    const {success} = updateSchema.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            msg: "Error while updatin info"
        })
    }
    // console.log(req.body)
    await User.updateOne({
        _id: req.userId
    }, req.body)
    res.json({
        msg: "Update Info"
    })
})

//get all users
router.get("/bulk",adminMiddleware, async(req, res) => {
    const filter = req.query.filter || "";  

    const users = await User.find({
        $or:[{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
            "$regex":filter
            }
        }]
    })
    res.json({
        user:   users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            balance: user.balance,
            isAdmin: user.isAdmin
        }))
    })
})

module.exports = router;