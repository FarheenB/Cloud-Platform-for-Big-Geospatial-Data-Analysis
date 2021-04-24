import React from 'react';
import logo from '../../static/images/cloud-logo.png';
import './NavBar.css';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
function Header(props) {
    // const capitalize = (s) => {
    //     if (typeof s !== 'string') return ''
    //     return s.charAt(0).toUpperCase() + s.slice(1)
    // }
    // let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    // if(props.location.pathname === '/') {
    //     title = 'Welcome'
    // }
    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        props.history.push('/login')
    }
    return(
        <header className="">
            <nav className="navbar">
            <div class="logo"> <a href="/"> <img src={logo} alt=""/> <span>Platform for Data Analysis</span></a> </div>
            <ul className="tabs right">  
                <li className="tab "> <a href="/dataset">Dataset</a>  </li>                
                <li className="tab "> <a href="/case_studies">Case Studies</a>  </li>    
                <li className="tab "> <a href="/platform">Platform</a> </li>
                <li className="tab "> <a href="/login/">Login</a> </li> 
            </ul> 
            
            </nav>
        </header>
        

          
    )
}
export default withRouter(Header);