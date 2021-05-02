import React from 'react';
import project_logo from '../../static/images/create-project-logo.png';

const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (

    <div className="create-projects hv-center" ref={buttonRef}
    onClick={showModal}>
                        
            {/* <div> */}
              <div className="mt-5 card hv-center">
                  <div className="inner-card">
                      <img src={project_logo} alt=""/>
                      <div className="container">
                      <span>Create new project</span>
                      </div>
                  </div>
              </div>
            {/* </div> */}
      {triggerText}

        </div>

   

  );
};
export default Trigger;