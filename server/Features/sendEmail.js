import nodemailer from "nodemailer";
import Otp from "../Models/otpModel.js";
import { otpGenerator } from "../Features/feature.js";
import User from "../Models/userModel.js";

const sendEmail=async(req,res)=>{
    try{
        const {email}=req.body;

        let user=await User.findOne({email}).select("-password");
    
        if(!user) return res.status(500).send({success:false,message:"User Does not Exists"});

        let otp=otpGenerator();
    
        const otpFind=await Otp.findById(user._id);
    
        if(otpFind) await Otp.findByIdAndDelete(user._id);
    
        await Otp.create({_id:user._id,otpvalue:otp}); 
        
        let transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
              user:process.env.FROM_EMAIL,
              pass:process.env.FROM_PASSWORD
            }
        })
    
        let mailOptions={
            from:process.env.FROM_EMAIL,
            to:email,
            subject:"Forgot Password ",
            html:`Otp to Forgot Password is : <b>${otp}</b>`
        }
    
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({success:true,message:"Email Sent successfully",user});
    }
    catch(error){
        res.status(500).json({success:false,message:"Error in Senting Email",error:error.message});
    }
}

const eventRegisterEmail=async(req,res)=>{
    try{
        const {email,name,eventDetail}=req;

        let user=await User.findOne({email}).select("-password");
    
        if(!user) return res.status(500).send({success:false,message:"User Does not Exists"});

        const eventHost=await User.findById(eventDetail.user_id);

        if(!eventHost) return res.status(500).send({success:false,message:"Host Does not Exists"});

        let transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
              user:process.env.FROM_EMAIL,
              pass:process.env.FROM_PASSWORD
            }
        })
        // Date: [Date of the Event]
        // Time: [Start Time (with Timezone)]
    
        let mailOptions={
            from:process.env.FROM_EMAIL,
            to:email,
            subject:`Confirmation: Your Event Registration is Successful!`,
            text:`
            Dear ${name},

            Exciting news! Your registration for ${eventDetail.blog_title} has been successfully confirmed. We're thrilled to have you join us for this special online event! 🎉
            
            Here are the key details:
            
            Event: ${eventDetail.blog_title}
            Location: Online Event
           
            Should you have any questions or require assistance, feel free to contact us at ${eventHost.email}.
            
            Thank you for registering. We can't wait to see you at ${eventDetail.blog_title}!
            
            Warm regards,
            
            Pratham chhabra
            Event Ease
            `
        }
    
        await transporter.sendMail(mailOptions);
    
        res.status(200).send({success:true,message:"Registered Event Successfully"});
    }
    catch(error){
        res.status(500).json({success:false,message:"Error in Confirmation Email",error:error.message});
    }
}
export {sendEmail,eventRegisterEmail};