import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const signup= async (req,res)=>{
    const {email,fullName,password,bio}=req.body;
    try{
        if(!email || !fullName || !password || !bio){
            return res.json({success:false,message:"Missing Details"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.json({success:false,message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({fullName,email,password:hashedPassword,bio});
        const token=generateToken(newUser._id);
        res.json({success:true,userData:newUser,token,message:"Account Created Successfully"});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const login= async (req,res)=>{
    const {email,password}=req.body;
    try{
        const userData=await User.findOne({email});
        if(!userData){
            return res.json({success:false,message:"Account doesn't exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,userData.password)
        if(!isPasswordCorrect){
            return res.json({success:false,message:"Enter Correct Password"});
        }
        const token=generateToken(userData._id);
        res.json({success:true,userData,token,message:"Login Successfully"});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user});
}

export const updateProfile=async(req,res)=>{
    const {bio,fullName,profilePic}=req.body;
    try{
        const userID=req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userID,{bio,fullName},{new:true});
        }else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userID,{profilePic:upload.secure_url,bio,fullName},{new:true});
        }
        res.json({success:true,user:updatedUser});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}