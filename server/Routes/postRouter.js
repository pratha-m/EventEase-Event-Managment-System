import express from "express";
import { createPost, deleteBlog, getAllBlogs, getEachBlog, getUserBlogs, registerEvent } from "../Controllers/postController.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const postRouter=express.Router();

postRouter.post("/create",isAuthenticated,createPost);

postRouter.post("/each",isAuthenticated,getUserBlogs);

postRouter.post("/all",getAllBlogs);

postRouter.post("/delete",isAuthenticated,deleteBlog);

postRouter.post("/get/each",getEachBlog);

postRouter.post("/register-event/:eventId",isAuthenticated,registerEvent);

export default postRouter;