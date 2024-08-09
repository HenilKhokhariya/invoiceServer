const  getOtp = require( '../geterateOtp');
const {Admin} = require('./module/admin')
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.cryptr_pw_key);
const sendRegister = require("../Email/adminRegister");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.jwt_key;

const Home = async(req,res)=>{
    try {
        return res.status(200).json({message:"Home Page"})
    } catch (error) {
        return res.status(400).json({message:"Server Error"});
    }
}

const AdminCreateOtp = async(req,res)=>{
    try {
        const {email,a_name,password} = await req.body;
        const otp = getOtp.generateOTP(6);
        const userExist = await Admin.findOne({email});
        if(userExist){
            return res.status(400).json({status:false,message:"Email Already Exist !"});
        }
        const playload= {
            email,
            a_name,
            password,
            otp
        }
        sendRegister.main(email,otp,a_name);
        const token = jwt.sign(playload,jwt_key,{expiresIn:'5m'})
        return res.status(200).json({status:true,message:"Otp Send Successfully !",token});
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false,message:"Server Error"});
    }
}

const AdminCreate = async(req,res)=>{
    try {
        const token = await req.headers.authorization.split(' ')[1];
        const otp = await JSON.parse(req.body.otp);
        jwt.verify(token,jwt_key);
        const data = jwt.decode(token,jwt_key);
        const compare = data.otp == otp;
        if(!compare)
        {
        return res.status(400).json({status:false,message:"Otp Invalid"});
        }
        const email = data.email;
        const a_name = data.a_name;
        const pw = data.password;
        const password = cryptr.encrypt(pw);
        const userExist = await Admin.findOne({email});
        if(userExist){
            return res.status(400).json({status:false,message:"Email Already Exist !"});
        }
        await Admin.create({a_name,email,password})
        const playload= {
            email,
            a_name,
            password
        }
        sendRegister.main(email,otp,a_name);
        const newtoken = jwt.sign(playload,jwt_key);
        return res.status(200).json({status:true,message:"Register Successfully !",token:newtoken});
    } catch (error) {
        console.log(error);
        return res.status(400).json({status:false,message:"Otp Expier"});
    }
}

module.exports = {Home,AdminCreateOtp,AdminCreate};