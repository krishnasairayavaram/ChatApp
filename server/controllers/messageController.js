import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js";

export const getUsersForSidebar=async(req,res)=>{
    try{
        const userID=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userID}}).select("-password");
        const unseenMessages={};
        const promises=filteredUsers.map(async (user)=>{
            const messages=await Message.find({senderID:user._id,receiverID:userID,seen:false});
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const getMessages=async(req,res)=>{
    try{
        const selectedUserId=req.params.id;
        const myId=req.user._id;
        const messages=await Message.find({$or:[{senderID:myId,receiverID:selectedUserId},{senderID:selectedUserId,receiverID:myId},]});
        await Message.updateMany({senderID:selectedUserId,receiverID:myId},{seen:true});
        res.json({success:true,messages});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const markMessageAsSeen=async(req,res)=>{
    try{
        const id=req.params.id;
        await Message.findByIdAndDelete(id,{seen:true});
        res.json({success:true});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const receiverID=req.params.id;
        const text=req.body.text;
        const image=req.body.image;
        const senderID=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({senderID,receiverID,text,image:imageUrl});
        const receiverSocketId=userSocketMap[receiverID];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.json({success:true,newMessage});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}