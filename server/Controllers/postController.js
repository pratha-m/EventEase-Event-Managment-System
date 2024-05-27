import { milliSecToHour, milliSecToMinute } from "../Features/feature.js";
import Blog from "../Models/blogModel.js";
import User from "../Models/userModel.js";

const createPost=async(req,res)=>{
    try{
        const userId=req.userId;
        const {blog_title,blog_description_html,blog_description_text,blog_image_url,blog_category,deadline}=req.body;

        const user=await User.findById(req.userId);

        if(!user) return res.status(404).json({success:false,message:"User Not Found"});

        await Blog.create({
            blog_title:blog_title,
            blog_description_html:blog_description_html,
            blog_description_text:blog_description_text,
            blog_image_url:blog_image_url,
            blog_category:blog_category,
            user_id:userId,
            deadline:deadline
        })

        const blogs=await Blog.find({user_id:req.userId});

        await user.save();

        res.status(200).send({success:true,message:"Post created successfully",blogs:blogs});
    }
    catch(error){
        res.status(500).send({success:false,message:"Error in Creating Event",error:error.message});
    }
}
const getUserBlogs=async(req,res)=>{
   try{
      const userId=req.userId;

      const blogs=await Blog.find({user_id:userId});

      res.status(200).send({success:true,message:"get blogs successfully",blogs:blogs});
   }
   catch(error){
       res.status(500).send({success:false,message:"Error in getting Events",error:error.message});
   }   
}
const getAllBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find({});

        let blog_categories=[];

        blogs.forEach((eachBlog)=>{
            const {blog_category}=eachBlog;
            if(!blog_categories.includes(blog_category)) blog_categories.push(blog_category);
        })
       
        res.status(200).send({success:true,message:"get blogs successfully",blogs,blog_categories});
     }
     catch(error){
         res.status(500).send({success:false,message:"Error in getting Posts",error:error.message});
     }   
}
const deleteBlog=async(req,res)=>{
    try{
        const {blogId}=req.body;

        const user=await User.findById(req.userId);

        if(!user) return res.status(404).json({success:false,message:"User Not Found"});

        await Blog.findByIdAndDelete(blogId);

        const blogs=await Blog.find({user_id:req.userId});
        
        res.status(200).send({success:true,message:"Event delted successfully",blogs:blogs});
    }
    catch(error){
        res.status(500).send({success:false,message:"Error in Deleting Event",error:error.message});
    }
}
const getEachBlog=async(req,res)=>{
    try{
        const {blogId}=req.body;

        const findBlog=await Blog.findById(blogId);

        res.status(200).send({success:true,message:"get blog successfully",blog:findBlog});
     }
     catch(error){
         res.status(500).send({success:false,message:"Error in getting Blog",error:error.message});
     }  
}
const registerEvent=async(req,res,next)=>{
    try{
        const {eventId}=req.params;

        const userId=req.userId;

        if(!userId || !eventId) return res.status(404).send({success:false,message:"Event Not Found"});

        const user=await User.findById(userId);        

        if(!user) return res.status(404).send({success:false,message:"User Not Found"});

        const findEvent=await Blog.findById(eventId);

        if(!findEvent) return res.status(404).send({success:false,message:"Event Not Found"});

        if(Date.now()>findEvent.deadline) return res.status(400).send({success:false,message:"Registrations Closed For this event"});

        const {registered_users}=findEvent;

        if(registered_users.includes(userId)) return res.status(404).send({success:false,message:"User Already Registered For this event"});

        findEvent.registered_users.push(userId);

        await findEvent.save();

        req.email=user.email;
        req.name=user.name;
        req.eventDetail=findEvent;

        next();
    }
    catch(error){
        res.status(500).send({success:false,message:"Error in Registering Event",error:error.message});
    }
}
const eventRegisteredUsers=async(req,res)=>{
    try{
        const {eventId}=req.params;

        const userId=req.userId;

        if(!userId || !eventId) return res.status(404).send({success:false,message:"Event Not Found"});

        const user=await User.findById(userId);        

        if(!user) return res.status(404).send({success:false,message:"User Not Found"});

        const findEvent=await Blog.findById(eventId);

        if(!findEvent) return res.status(404).send({success:false,message:"Event Not Found"});

        const populateBlog=await findEvent.populate({
            path:"registered_users",
            select:"-password"
        });

        res.status(200).send({success:true,message:"get Registered Users successfully",details:populateBlog});
    }
    catch(error){
        res.status(500).send({success:false,message:"Error in Gettinh Registered Users",error:error.message});
    }
}
export {createPost,getUserBlogs,getAllBlogs,deleteBlog,getEachBlog,registerEvent,eventRegisteredUsers};