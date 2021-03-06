import React from "react";
import { withRouter } from "react-router-dom";
import './CreateProject.css';
 
const Popup = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
 
export default withRouter(Popup);
