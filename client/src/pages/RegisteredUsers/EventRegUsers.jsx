import { useEffect, useState } from 'react';
import axios from 'axios';
import "./EventRegUsers.css"
import { useLocation, useNavigate } from 'react-router-dom';

const EventRegUsers = ({setTopBarProgress}) => {
  const [eventDetails, setEventDetails] = useState({isLoading:true,event:{}});

  const location=useLocation();
  const params=new URLSearchParams(location.search);
  const blogId=params.get("blogid")

  const getAllRegUsers=async()=>{
    try{
      setEventDetails((prev)=>({...prev,isLoading:true}))
      setTopBarProgress(60)
      const result=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post/event-registered-users/${blogId}`,{},{withCredentials:true});
      if(result.status==200){
        setTopBarProgress(100)
        setEventDetails({isLoading:false,event:result.data.details})
      }  
    }
    catch(error){
      setEventDetails((prev)=>({...prev,isLoading:false}))
      setTopBarProgress(100)
      if(error.response) console.log(error.response.data.message)
      else console.log("error in geting registered Users");
    }
}

useEffect(()=>{
  getAllRegUsers();
},[])

  return (
    <>
    <div className="eventRegUsers">
      <h2>Event Registered Users</h2>
      {eventDetails.isLoading && <p>Loading...</p>}
      {!eventDetails.isLoading && eventDetails.event.registered_users.length==0 && <p>No Registered Users For This Event.</p>}
      {!eventDetails.isLoading && eventDetails.event.registered_users.length!=0 &&  
        <table border="1">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Event Name</th>
            <th>User Name</th>
            <th>User Email ID</th>
            <th>Event ID</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
        {!eventDetails.isLoading && eventDetails.event.registered_users && eventDetails.event.registered_users.map((eachUser, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{eventDetails.event.blog_title}</td>
              <td>{eachUser.name}</td>
              <td>{eachUser.email}</td>
              <td>{eventDetails.event._id}</td>
              <td>{eachUser._id}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
    </>
  );
};

export default EventRegUsers;