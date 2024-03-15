const User = require("../models/user.model");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken")


const idSchema = Joi.object({
    id: Joi.string().length(24).hex().required(),
});



class userController{

#refTokens=[]

check=async(req,res)=>{
    console.log(this.#refTokens)
    res.status(200)
}

//create a new user

CreateNewUser= async (req,res) => {
    try {
        const hashPass=await bcrypt.hash(req.body.password,10)
        const userd={username:req.body.username,id:req.body.id,password:hashPass}
        console.log(userd.username)
        const user =await User.create(userd)
         
        res.status(200).json(user);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
}


// Refersh 

Refresh= async (req,res) => {
    try {
        const refToken=req.body.token
        console.log(refToken)
        const refTokenslist=(JSON.parse(req.cookies.jwt))
        console.log(refTokenslist)
        if (refToken==null) return res.sendStatus(401)
        if (!refTokenslist.includes(refToken)) return res.sendStatus(403)
        if (!refToken) return res.sendStatus(403)
        jwt.verify(refToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        const access_Token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
        res.json({access_Token:access_Token})
    })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
}

// Login User 

LoginUser= async (req,res) => {
    try {
        const { username, id, password } = req.body
        const userdb = await User.findOne({username})
        if (userdb===null){
            return res.status(400).send('User does not exist In Db')
        }  
        const chk = await bcrypt.compare(password,userdb.password)
        if (chk){
            const user ={username,id}
            const access_Token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'35s'})
            const refToken =jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'2m'})
            this.#refTokens.push(refToken)
            console.log(this.#refTokens)
            const s=JSON.stringify(this.#refTokens)
            res
            .cookie('jwt', s, { 
                httpOnly: true,
                sameSite: true,
                sameSite:'None',
                maxAge:1000*60*2
             })
            .json({access_Token:access_Token, ref_Token:refToken})
        } else{
            return res.status(400).send("invaild password")
        }                        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
}

//logout

Logout = async(req,res) =>{
    try {
        console.log("logout")
        const refToken=req.body.token
        console.log(refToken)
        let refTokenslist=(JSON.parse(req.cookies.jwt))
        console.log(refTokenslist)
        if (!refTokenslist.includes(refToken)){
            return res.status(400).send("invaild")
        }
        refTokenslist=refTokenslist.filter(token => token !== req.body.token)
        const s=JSON.stringify(refTokenslist)
        res.cookie('jwt', s, { 
                httpOnly: true,
                sameSite:'None',
                maxAge:1000*60*2
             }).sendStatus(204)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

//delete a user

handleDeleteUser= async (req,res) =>{
    try {
        const {id} = req.params;
        const {error}=idSchema.validate({id});
        if (error) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${id}`})
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


}

module.exports=new userController