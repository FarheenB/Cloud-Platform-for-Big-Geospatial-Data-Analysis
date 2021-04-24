import React from 'react';
import logo from '../../static/images/cloud-logo.png'
import './Footer.css';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
function Footer(props) {
    return(
        <div className="footer">
            <span>Developed by @<a href="https://www.linkedin.com/in/farheen-bano/">Farheen</a></span>
        </div>         
    )
}
export default withRouter(Footer);