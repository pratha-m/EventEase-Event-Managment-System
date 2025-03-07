import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import {Link} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Profile = ({userData,setTopBarProgress,successToast,errorToast}) => {
  const [blogTitle,setBlogTitle]=useState("");
  const [blogDescriptionHTML,setBlogDescriptionHTML]=useState(""); 
  const [blogDescriptionText,setBlogDescriptionText]=useState(""); 
  const [blogImgUrl,setBlogImgUrl]=useState(""); 
  const [blogCategory,setBlogCategory]=useState("");
  const [blogsData,setBlogsData]=useState({isLoading:true,blogs:[]})
  const [blogCategories,setBlogCategories]=useState({isLoading:true,categories:[]})
  const [eventDeadline,setEventDeadline]=useState("");

    const createBlog=async(e)=>{
    e.preventDefault(); 
    console.log(eventDeadline)
    if(blogTitle && blogDescriptionHTML && blogImgUrl && blogCategory && eventDeadline){
        try{
            setTopBarProgress(50);
            setBlogsData({...blogsData,isLoading:true})
            const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/create`,{
                blog_title:blogTitle,
                blog_description_html:blogDescriptionHTML,
                blog_description_text:blogDescriptionText,
                blog_image_url:blogImgUrl,
                blog_category:blogCategory,
                deadline:eventDeadline
            },{withCredentials:true});
            if(result.status==200){
                setBlogsData({isLoading:false,blogs:result.data.blogs})
                fetchAllBlogs();
                setBlogTitle("");
                setBlogDescriptionHTML("");
                setBlogDescriptionText("");
                setBlogImgUrl("");
                setBlogCategory("");
                setEventDeadline("");
                setTopBarProgress(100);
                successToast("Event Created Successfully")
            }
        }
        catch(error){
            setBlogsData({...blogsData,isLoading:false})
            setTopBarProgress(100);
            if(error.response){
                console.log(error.response.data.message)
                errorToast(error.response.data.message)
            }
            else{
                errorToast("Error in creating Event")
            }
        }
    }
    else{
        errorToast("Eneter All Fields")
    }
    }
    const fetchUserBlogs=useCallback(async()=>{
        try{
            setBlogsData((prev)=>({...prev,isLoading:true}))
            const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/each`,{},{withCredentials:true});
            if(result.status==200){
                setBlogsData({isLoading:false,blogs:result.data.blogs})
            }   
        }
        catch(error){
            setBlogsData((prev)=>({...prev,isLoading:false}))
            if(error.response){
                console.log(error.response.data.message)
            }
            else{
                console.log("error in getting Events");
            }
        }
    },[])
    const fetchAllBlogs=useCallback(async()=>{
        try{
            setBlogCategories((prev)=>({...prev,isLoading:true}))
            const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/all`,{});
            if(result.status==200){
                setBlogCategories({isLoading:false,categories:result.data.blog_categories});
            }   
        }
        catch(error){
            setBlogCategories((prev)=>({...prev,isLoading:false}))
            if(error.response){
                console.log(error.response.data.message)
            }
            else{
                console.log("error in getting Events");
            }
        }
    },[])
 
    useEffect(()=>{
       fetchUserBlogs();
       fetchAllBlogs();
    },[fetchUserBlogs,fetchAllBlogs]);
  const deleteBlog=async(blogId)=>{
    try{
      setBlogsData({...blogsData,isLoading:true})
      const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/delete`,{blogId},{withCredentials:true});
      if(result.status==200) setBlogsData({isLoading:false,blogs:result.data.blogs})
    }
    catch(error){
      setBlogsData({...blogsData,isLoading:false})
      if(error.response) console.log(error.response.data.message)
      else console.log("error in creating Event")
    }
  }
  const titleTrimming=(title)=>{
    if(title) return (title.length<36?title:`${title.substring(0,35)}...`)
    else return "N/A";
  }
  const descriptionTrim=(desc)=>{
    if(desc) return desc.length<141?desc:desc.substring(0,140);
    else return "N/A";
  }

  const handleEditChange=(val,delta,source,editor)=>{
    setBlogDescriptionText(editor.getText());
    setBlogDescriptionHTML(val);
  }

  const today=new Date();
  const tomorrow=new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate=tomorrow.toISOString().split('T')[0];

  return (
    <div className="profilePage">
        <div className="myProfile">
            <h1>My Profile</h1>
            <form>
                <label htmlFor="name">Name :<input type="text" value={userData.name} disabled/></label>
                <label htmlFor="name">Email :<input type="text" value={userData.email} disabled/></label>
            </form>
        </div>
        <div className="createBlog">
            <h1>Create Event</h1>
            <form onSubmit={createBlog}>
                <label htmlFor="blogTitle">Title : <input type="text" name="blogTitle" value={blogTitle} onChange={(e)=>{setBlogTitle(e.target.value)}}/></label>
                <label htmlFor="eventDeadline">Event Deadline : <input type="date" name="eventDeadline" value={eventDeadline} onChange={(e)=>{setEventDeadline(e.target.value)}} min={minDate}/></label>
                <label htmlFor="blogDescription">Description : 
                    {/* <textarea type="text" name="blogDescription" value={blogDescription} onChange={(e)=>{setBlogDescription(e.target.value)}}/> */}
                    <div className='editorContainer' style={{  backgroundColor:"transparent"}}>
                        <ReactQuill 
                            theme="snow" 
                            value={blogDescriptionHTML} 
                            onChange={handleEditChange} 
                            className='custom-editor' 
                            style={{ width: '100%', height:'100%' }}
                            modules={{
                              toolbar: [
                                  [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                                  [{size: []}],
                                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                  [{'list': 'ordered'}, {'list': 'bullet'}, 
                                   {'indent': '-1'}, {'indent': '+1'}],
                                  ['link', 'image', 'video'],
                                  ['clean']
                              ]
                            }}
                        />
                    </div>
                </label>
                <label htmlFor="blogImgUrl">Url : <input type="url" name="blogImgUrl" value={blogImgUrl} onChange={(e)=>{setBlogImgUrl(e.target.value)}}/></label>
                <label htmlFor="blogCategory">Category : <input name="blogCategory" autoComplete="off" value={blogCategory} onChange={(e)=>{setBlogCategory(e.target.value)}} list="categories" id="blogCategory"/>
                    <datalist id="categories">
                       {blogCategories.isLoading && "Loading..."}
                       {!blogCategories.isLoading && blogCategories.categories && blogCategories.categories.map((eachCategory)=>{
                            return (<option key={eachCategory} value={eachCategory}/>)
                       })}
                    </datalist>
                </label>
                <button>Create Event</button>
            </form>
        </div>
        <div className="myBlogs">
            <h1>My Events</h1>
            <div className="blogsContainer">
                {blogsData.isLoading && "Loading..."}
                {!blogsData.isLoading && blogsData.blogs.length<1 && "Sorry No Events Found"}
                {
                    !blogsData.isLoading && blogsData.blogs && blogsData.blogs.map((eachBlog)=>{
                    return (
                       <div key={eachBlog._id} className="eachBlog">
                           <div  className="eachBlogImage">
                            <img src={eachBlog.blog_image_url} />
                           </div>
                           <div className="eachBlogText">
                               <h2>{titleTrimming(eachBlog.blog_title)}</h2>
                               {eachBlog.blog_category && <span className="blogCategory">{eachBlog.blog_category}</span>}
                               <p>
                                  {descriptionTrim(eachBlog.blog_description_text)}
                                  {eachBlog.blog_description_text.length>=141}
                                    <Link className="readMoreLink" to={`/blogs/?blogid=${eachBlog._id}`}>Read More</Link>
                                    <Link className="readMoreLink" to={`/event-users/?blogid=${eachBlog._id}`}>Registered Users</Link>
                               </p>
                           </div>
                           <div className="deleteBtn" onClick={()=>{deleteBlog(eachBlog._id)}}>
                             <img src="/images/crossicon.png" alt="" />
                           </div>
                       </div>
                    ); 
                })}
         </div>
        </div>
    </div>
  )
}

export default Profile