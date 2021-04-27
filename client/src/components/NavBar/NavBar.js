import React, {useState} from 'react';
import logo from '../../static/images/cloud-logo.png';
import './NavBar.css';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
function NavBar(props) {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const activeUser=(sessionStorage.getItem("access_token") !== null && sessionStorage.getItem("access_token")!=="undefined");
    const [state , setState] = useState({
        username : rememberMe? localStorage.getItem('username') : activeUser ? sessionStorage.getItem('username') : '',
        email: rememberMe? localStorage.getItem('email') : activeUser ? sessionStorage.getItem('email') : '',
        rememberMe:rememberMe
    })

    // const capitalize = (s) => {
    //     if (typeof s !== 'string') return ''
    //     return s.charAt(0).toUpperCase() + s.slice(1)
    // }
    // let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    // if(props.location.pathname === '/') {
    //     title = 'Welcome'
    // }
    // const componentDidMount=()=> {
        
        // const 
        // const 

        // setState({ username, email,rememberMe });
        console.log(state);
      
    // }
    // function renderLogout() {
    //     if(props.location.pathname === '/home'){
    //         return(
    //             <div className="ml-auto">
    //                 <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
    //             </div>
    //         )
    //     }
    // }
    function handleLogout() {
        sessionStorage.clear();
        if(state.rememberMe){
            localStorage.clear();

        }
        props.history.push('/home')
    }
    return(
        <header className="">
            <nav className="navbar"> 

                <div className="hamburger"> 
                    <img src="https://www.gstatic.com/images/icons/material/system/2x/menu_black_24dp.png" alt="Menu"/> 
                </div> 
                <div class="logo"> <a href="/"> <img src={logo} alt=""/> <span>Platform for Data Analysis</span></a> </div>
                    <ul className="tabs right"> 
                    <li className="tab "> <a href="/faq">FAQ</a>  </li>                
                    <li className="tab "> <a href="/dataset">Dataset</a>  </li>                
                    <li className="tab "> <a href="/case_studies">Case Studies</a>  </li>    
                    <li className="tab "> <a href="/platform">Platform</a> </li>
                    <li className="tab "> <a href="/projects">Projects</a> </li>

                    
                    <li className="tab "> {state.username==="" && <a href="/login/">Login</a> }</li> 
                    {state.username!=="" &&
                    <li className="tab "> <a href="/home"><i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i></a> 
                        <ul className="dropdown">   
                            <li className="username"> <a href="/profile"><span><i class="fa fa-bookmark-o"></i></span><span>{state.username}</span></a></li> 
                            <li> <a href="/notebook"><span><i class="fa fa-file-code-o"></i></span><div>Notebook</div></a> </li> 
                            <li> <a href="/sessions"><span><i class="fa fa-bar-chart-o"></i></span><span>Sessions</span></a> </li> 
                            <li onClick={() => handleLogout()}> <a href=""><span><i class="fa fa-sign-out signout" ></i></span><span>Logout</span></a> </li> 
                        </ul>  
                    </li>   }
                </ul> 
                
            
            </nav>
        </header>
        

          
    )
}
export default withRouter(NavBar);