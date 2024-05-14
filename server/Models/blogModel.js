import mongoose from "mongoose"

const blogSchema=mongoose.Schema({
    blog_title:{
        type:String,
        required:true
    },
    blog_description_html:{
        type:String,
        required:true
    },
    blog_description_text:{
        type:String,
        required:true
    },
    blog_image_url:{
        type:String,
        required:true
    },
    blog_category:{
        type:String
    },
    user_id:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true
    },
    registered_users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})
const Blog=mongoose.model("Blog",blogSchema);

export default Blog;