import { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom";
import { Link } from 'react-router-dom';
import {AiFillCodepenCircle, AiFillLinkedin, AiFillPhone} from "react-icons/ai"
import {FaLocationArrow} from "react-icons/fa"
import {AiFillMail} from "react-icons/ai"
import {AiFillGithub} from "react-icons/ai"
import {FaDev} from "react-icons/fa";
import "../css/components/Footer.css";

const Footer = () => {
  const location=useLocation();
  const [urlPath,setUrlPath]=useState(location.pathname);

  useEffect(()=>{
    setUrlPath(location.pathname);
  },[location.pathname])
  return (
    <footer>
    <div className="detailsSection">
       <div className="companySummary">
            <div>
             <h2>EventEase</h2>
             <p>Explore the latest insights and trends on our vibrant blog. Stay informed, entertained, and inspired with our diverse range of articles. Join our community of readers and contributors, and discover a wealth of knowledge at your fingertips. Thank you for being part of our journey.</p>
            </div>
       </div>
       <div className="quickLinks">
           <div>
              <h2>Quick Links</h2>
             <ul>
                 <li><Link to="/"><i></i>Home</Link></li>
                 <li><Link to="/about"><i></i>About</Link></li>
                 <li><Link to="/contact"><i></i>Contact</Link></li>
              </ul>
           </div>
       </div>
       <div className="contactDetails">
            <div>
               <h2>Contact Info</h2>
               <span><AiFillPhone/>91+XXXXXXXXXX</span>
               <span style={{"userSelect":"text"}}><AiFillMail/>abcd@gmail.com</span>
               <span><FaLocationArrow/>Rajpura,Punjab,India-140401</span>
               <span className="socialLinks">
                <ul>
                    <li><Link to="https://www.linkedin.com/in/pratham-chhabra-14b28a22b" target='_blank' className="eachSocialLink"><AiFillLinkedin/></Link></li>
                    <li><Link to="https://github.com/pratha-m" target='_blank' className="eachSocialLink"><AiFillGithub/></Link></li>
                    <li><Link to="https://codepen.io/pratha-m" target='_blank' className="eachSocialLink"><AiFillCodepenCircle/></Link></li>
                    <li><Link to="https://dev.to/pratham_63" target='_blank' className="eachSocialLink"><FaDev/></Link></li>
                </ul>
               </span>
            </div>
       </div>
    </div>
    <div className="copyrightSection">
        <p>Copyright@2023</p>
    </div>
    </footer> 
  )
}

export default Footer