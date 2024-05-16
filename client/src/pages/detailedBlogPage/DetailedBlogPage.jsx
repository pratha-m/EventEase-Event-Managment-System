import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./DetailedBlogPage.css";
// import TextSlider from "../../components/textSlider/TextSlider";
import parse from "html-react-parser";


const DetailedBlogPage=()=>{
  const [eachBlog,setEachBlog]=useState({isLoading:true,blog:{}});  
  const navigate=useNavigate();
  
  const location=useLocation();
  const params=new URLSearchParams(location.search);
  const blogId=params.get("blogid")
   
  const getEachBlog=useCallback(async()=>{
    try{
        setEachBlog((prev)=>({...prev,isLoading:true}))
        const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/get/each`,{blogId},{withCredentials:true});
        if(result.status==200){
            setEachBlog({isLoading:false,blog:result.data.blog})
        }   
    }
    catch(error){
        setEachBlog((prev)=>({...prev,isLoading:false}))
        navigate("/");
    }    
  },[blogId,navigate]);

  useEffect(()=>{
    getEachBlog();
  },[getEachBlog])

  return (
    // <div className="detailBlogPage">
    //     <div className="blogPageContainer">
    //        <h1 className="blogTitle">{eachBlog.blog.blog_title}</h1>  
    //        <div className="blogImage">
    //          <img src={eachBlog.blog.blog_image_url} alt="" />
    //        </div>
    //        <div className="blogDescription">{eachBlog.blog.blog_description_html && parse(eachBlog.blog.blog_description_html)}</div>
    //     </div>
    // </div>

    <div className="detailEventPage">
    <div className="eventPageContainer">
      <div className="Image">
        <img src={eachBlog.blog.blog_image_url}
          className="Image"
        ></img>
      </div>

      <h1 className="eventTitle">{eachBlog.blog.blog_title}</h1> {/* Title of the event */}
      <div className = "Register">
        <div className = "registerDate">
        <h4>Deadline to register: 10/06/2024 </h4></div> {/* Last date */}

        <div className = "registerButton">
          <button className="button-74" role="button">  Register  </button> {/* API */}
        </div>
        
      </div>

      {/* <h2 className="eventTitle">Event specifics</h2> */}

      <div className="eventDescription" >
        <p>
        {eachBlog.blog.blog_description_html && parse(eachBlog.blog.blog_description_html)}
        </p> {/* Blog description along with the styling as given by the user if possible */}
      </div>
    </div>
  </div>
  )
}

export default DetailedBlogPage