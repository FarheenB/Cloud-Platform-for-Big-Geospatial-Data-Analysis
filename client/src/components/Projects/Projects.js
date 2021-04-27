import React, {useState} from 'react';
import axios from 'axios';
import './Projects.css';
import project_logo from '../../static/images/create-project-logo.png';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function Projects(props) {
    const redirectToCreateProjects = () => {
        props.history.push('/projects'); 
        props.updateTitle('Project');
    }
    return(
        <div className="projects">

            <div className="create-projects hv-center">
                
                <a href="/create_project">
                    <div className="mt-5 card hv-center">
                        <div className="inner-card">
                            <img src={project_logo} alt=""/>
                            <div className="container">
                            <span>Create new project</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
         

            <div class="row">
                <div class="column">           
                    <div className="mt-5 card hv-center">
                        <div className="projects-container">
                            <span><h3><a href="/project">Project 1</a></h3></span>
                            <span><p>This is the demo project</p></span>
                        </div>
                    </div>
                </div>
                <div class="column">           
                    <div className="mt-5 card hv-center">
                        <div className="projects-container">
                            <span><h3><a href="/project">Project 2</a></h3></span>
                            <span><p>This is the demo project</p></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
    )
}

export default withRouter(Projects);