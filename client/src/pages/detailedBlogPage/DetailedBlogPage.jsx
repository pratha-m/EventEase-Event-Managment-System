import axios from "axios";
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./DetailedBlogPage.css";
// import TextSlider from "../../components/textSlider/TextSlider";
import parse from "html-react-parser";


const DetailedBlogPage=({userData,userStatus,successToast,errorToast,setTopBarProgress})=>{
  const [eachBlog,setEachBlog]=useState({isLoading:true,blog:{}});  
  const [eventRegDetail,setEventRegDetail]=useState({isLoading:true,isRegistered:false});
  const navigate=useNavigate();
  
  const location=useLocation();
  const params=new URLSearchParams(location.search);
  const blogId=params.get("blogid")

  const isUserRegistered=(blogDetail)=>{
    return blogDetail && blogDetail.registered_users && userData && blogDetail.registered_users.includes(userData.id)
  }

  const getEachBlog=async()=>{
    try{
      setTopBarProgress(60);
      setEventRegDetail((prev)=>({...prev,isLoading:true}))
      setEachBlog((prev)=>({...prev,isLoading:true}))
      const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/get/each`,{blogId},{withCredentials:true});
      if(result.status==200){
          setTopBarProgress(100);
          setEachBlog({isLoading:false,blog:result.data.blog})
          if(isUserRegistered(result.data.blog)) setEventRegDetail({isLoading:false,isRegistered:true})
          else setEventRegDetail((prev)=>({...prev,isLoading:false}))      
      }   
  }
  catch(error){
      setEventRegDetail((prev)=>({...prev,isLoading:false}))
      setTopBarProgress(100);
      setEachBlog((prev)=>({...prev,isLoading:false}))
      navigate("/");
  }  
  }

  const handleRegisterEvent=async()=>{
    try{
      setEventRegDetail((prev)=>({...prev,isLoading:true}))
      setTopBarProgress(60)
      const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/register-event/${blogId}`,{},{withCredentials:true});
      if(result.status==200){
        setTopBarProgress(100)
        successToast(result.data.message)
        setEventRegDetail({isLoading:false,isRegistered:true})
      }  
    }
    catch(error){
      setEventRegDetail((prev)=>({...prev,isLoading:false}))
      setTopBarProgress(100)
      if(error.response) errorToast(error.response.data.message)
      else errorToast("error in Registering Event");
    }
  }

  const formateDate=(isoStr)=>{
    const date=new Date(isoStr);
    const year=date.getFullYear();
    const month=date.getMonth()+1;
    const day=date.getDate();
    return `${day}-${month}-${year}`;
  }

  useEffect(()=>{  
    if(!userStatus.isFetching) getEachBlog();
  },[userStatus,userData,blogId,navigate])

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
    <>
      {userStatus.isFetching && <p>Loading..</p>}
      {!userStatus.isFetching && (
        <div className="detailEventPage">
          <div className="eventPageContainer">
            <div className="Image">
              <img src={eachBlog.blog.blog_image_url} className="Image"></img>
            </div>
            <h1 className="eventTitle">{eachBlog.blog.blog_title}</h1>{" "}
            {/* Title of the event */}
            <div className="Register">
              <div className="registerDate">
                <h4>Deadline to register: {formateDate(eachBlog.blog.deadline)} </h4>
              </div>{" "}
              {/* Last date */}
              <div className="registerButton">
                {eventRegDetail.isLoading? (
                  <button
                    className="button-74 disabled-btn"
                    role="button"
                    disabled
                  >
                  Registring...
                  </button>
                ) :  eventRegDetail.isRegistered ? (
                  <button
                    className="button-74 disabled-btn"
                    role="button"
                    disabled
                  >
                    Registered
                  </button>
                ) : (
                  <button
                    className="button-74"
                    role="button"
                    onClick={handleRegisterEvent}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
            {/* <h2 className="eventTitle">Event specifics</h2> */}
            <div className="eventDescription">
              <div>
                {eachBlog.blog.blog_description_html &&
                  parse(eachBlog.blog.blog_description_html)}
              </div>{" "}
              {/* Blog description along with the styling as given by the user if possible */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailedBlogPage