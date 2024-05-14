import mongoose from "mongoose";

// const blogSchema=mongoose.Schema({
//     blog_title:{type:String,required:true},
//     blog_description:{type:String,required:true},
//     blog_image_url:{type:String},
//     blog_category:{type:String},
//     registered_users:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"user"
//     }]
// })
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified_otp_time:{
        type:Number,
        required:true
    },
    // blogs:[blogSchema]
})
const User=mongoose.model("User",userSchema);

export default User;