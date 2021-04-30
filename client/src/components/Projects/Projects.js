import React, {useState} from 'react';
import axios from 'axios';
import './Projects.css';
import project_logo from '../../static/images/create-project-logo.png';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            projects:[],
            status:""
        };
    }

    getData(){
        let username=localStorage.getItem('username');

        axios.get('/get_projects?username='+username).then(res => {
            let data = res.data
            this.setState({projects : data.projects})
        })
    }
    
    componentDidMount(){
        this.getData()
    }

    deleteProject(project_id){
        // fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
        // .then(() => this.setState({ status: 'Deleted successful' }));
    }

    render(){
        console.log("inside Project", this.state);

        return(
            <div class="row">
                <div class="column "> 
                    <div className="create-projects hv-center">                    
                        <a>
                            <CreateProject/>
                        </a>
                    </div>
                </div>
                {
                    this.state.projects.map(project => (       
                    <div class="column">           
                        <div className="projects hv-center">
                           
                                <div className="mt-5 card">
                                    <div className="inner-card">
                                        <div className="projects-details">
                                            <img src={project_icon} alt=""/>
                                            <div className="project-created-by">
                                                <span >
                                                    {project.created_by}
                                                </span>
                                            </div>
                                            <div className="project-time">
                                                <span >
                                                    {/* {Intl.DateTimeFormat('en-US',{
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit"
                                                    }).format(project.created_on)
                                                    } */}
                                                {/* { format(new Date(),'MMMM dd, yyyy')}  */}
                                                { project.timestamp} 
                                                    
                                                </span>
                                            </div>
                                        </div>
                                        <div className="project-title">
                                        <span><a href="/project">{project.title}</a></span>
                                        </div>
                                        <div className="project-description">
                                        <span>{project.description.substr(0,70)}
                                        {project.description.length>100 &&
                                        <span>...<a href="">Read More</a></span>
                                        }
                                        
                                        </span>
                                       
                                          

                                        </div>
                                    </div>
                                    <div><a href=""><i onClick={this.deleteProject(project.id)} class="fa fa-trash-o" aria-hidden="true"/></a>
                                    <a href=""><i class="fa fa-share-alt" aria-hidden="true"/></a>
                                    </div> 

                                </div>
                          
                        </div>

                    </div>
                    ))
                } 
            </div>         
        );
    }
}

export default withRouter(Projects);