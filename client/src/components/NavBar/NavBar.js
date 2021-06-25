import React, {useState} from 'react';
import logo from '../../static/images/cloud-logo.png';
import './NavBar.css';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            username:"",
            email:"",
            rememberMe:false
        };
    }

    getData() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true' && localStorage.getItem("access_token") !== null && localStorage.getItem("access_token")!=="undefined";
        const activeUser=(sessionStorage.getItem("access_token") !== null && sessionStorage.getItem("access_token")!=="undefined");
        this.setState({
            username : rememberMe? localStorage.getItem('username') : activeUser ? sessionStorage.getItem('username') : '',
            email: rememberMe? localStorage.getItem('email') : activeUser ? sessionStorage.getItem('email') : '',
            rememberMe:rememberMe
        })
    }

    componentDidMount(){
        this.getData();
    }


    handleLogout() {
        sessionStorage.clear();
        if(this.state.rememberMe){
            localStorage.clear();
        }
        window.location.replace('/home');
    }

    render(){
    return(
        <header className="">
            <nav className="navbar"> 

                <div className="hamburger"> 
                    <img src="https://www.gstatic.com/images/icons/material/system/2x/menu_black_24dp.png" alt="Menu"/> 
                </div> 
                <div class="logo"> <a href="/"> <img src={logo} alt=""/> <span>Data Analysis Platform</span></a> </div>
                    <ul className="tabs right"> 
                    {/* <li className="tab "> <a href="/faq">FAQ</a>  </li>                 */}
                    <li className="tab "> <a href="/dataset">Dataset</a>  </li>                
                    <li className="tab "> <a href="/case_studies">Case Studies</a>  </li>   
                    {/* <li className="tab "> <a href="/scripts">Scripts</a>  </li>     */}
                    <li className="tab "> <a href="/platform">Platform</a> </li>
                    <li className="tab "> <a href="/projects">Projects</a> </li>

                    
                    <li className="tab "> {this.state.username==="" && <a href="/login">Login</a> }</li> 
                    {this.state.username!=="" &&
                    <li className="tab "> <a><i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i></a> 
                        <ul className="dropdown">   
                            <li className="username"> <a href="/profile"><span><i class="fa fa-bookmark-o"></i></span><span>{this.state.username}</span></a></li> 
                            {sessionStorage.getItem('admin')==='true' &&
                                <li> <a href="/admin_"><span><i class="fa fa-user-o"></i></span><span>Admin</span></a> </li> 
                            }
                            <li> <a href="/notebook"><span><i class="fa fa-file-code-o"></i></span><div>Notebook</div></a> </li> 
                            <li> <a href="/sessions"><span><i class="fa fa-bar-chart-o"></i></span><span>Sessions</span></a> </li> 
                            <li onClick={() => this.handleLogout()}> <a><span><i class="fa fa-sign-out signout" ></i></span><span>Logout</span></a> </li> 
                        </ul>  
                    </li>   }
                </ul> 
                
            
            </nav>
        </header>
        

          
    );
}
    }
export default NavBar;