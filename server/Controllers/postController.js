import Blog from "../Models/blogModel.js";
import User from "../Models/userModel.js";

const createPost=async(req,res)=>{
    try{
        const userId=req.userId;
        const {blog_title,blog_description_html,blog_description_text,blog_image_url,blog_category}=req.body;

        const user=await User.findById(req.userId);

        if(!user) return res.status(404).json({success:false,message:"User Not Found"});

        await Blog.create({
            blog_title:blog_title,
            blog_description_html:blog_description_html,
            blog_description_text:blog_description_text,
            blog_image_url:blog_image_url,
            blog_category:blog_category,
            user_id:userId
        })

        const blogs=await Blog.find({});

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

        const blogs=await Blog.find({});
        
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
const registerEvent=async(req,res)=>{
    try{
        const {eventId}=req.params;

        const userId=req.body.userId;

        if(!userId || !eventId) return res.status(404).send({success:false,message:"Event Not Found"});

        const user=await User.find({_id:userId});        

        if(!user) return res.status(404).send({success:false,message:"User Not Found"});

        const event=Blog.findById(eventId);

        const {registered_users}=event;

        if(!registered_users.includes(userId)) event.registered_users.push(userId);

        await event.save();

        res.status(200).send({success:true,message:"Registered Event Successfully"});
    }
    catch(error){
        res.status(500).send({success:false,message:"Error in Registering Event",error:error.message});
    }
}
export {createPost,getUserBlogs,getAllBlogs,deleteBlog,getEachBlog,registerEvent};