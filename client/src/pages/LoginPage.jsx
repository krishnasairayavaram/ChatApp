import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
const LoginPage=()=>{
    const [currState,setCurrState]=useState("Login");
    const [fullName,setfullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [bio,setBio]=useState("");
    const [isDataSubmitted,setisDataSubmitted]=useState(false);
    const {login} =useContext(AuthContext);

    const handlesubmit=(event)=>{
        event.preventDefault();
        if(currState==="Sign up" && !isDataSubmitted){
            setisDataSubmitted(true);
            return;
        }
        login(currState==="Sign up"?'signup':'login',{fullName,email,password,bio});
    }
    return(
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop:blue-2xl">
            <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
            <form onSubmit={handlesubmit} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-md">
                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {currState}
                    {isDataSubmitted && <img onClick={()=>setisDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
                </h2>
                {currState==="Sign up" && !isDataSubmitted && (
                    <input onChange={(e)=>setfullName(e.target.value)} value={fullName} type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required />
                )}
                {!isDataSubmitted && (
                    <>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email Address" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Enter Password here" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </>
                )}
                {currState==="Sign up" && isDataSubmitted && (
                    <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Provide a short bio..." required></textarea>
                )}
                {currState==="Sign up"&&<div className="flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" required />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>}
                <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
                    {currState==="Sign up" ? "Create Account":"Login Account"}
                </button>
                <div className="flex flex-col gap-2 items-center">
                    {currState==="Sign up" ? (
                        <p className="text-md text-white">Already have an account? <span onClick={()=>{setCurrState("Login"); isDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Click here to Login</span></p>
                    ):(
                        <p className="text-md text-white">Don't have an account. <span onClick={()=>{setCurrState("Sign up");}} className="font-medium text-violet-500 cursor-pointer">Click here to Create</span></p>
                    )}
                </div>
            </form>
        </div>
    )
}
export default LoginPage;