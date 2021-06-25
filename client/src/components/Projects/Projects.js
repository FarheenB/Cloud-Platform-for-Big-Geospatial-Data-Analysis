import React, {useState} from 'react';
import axios from 'axios';
import './Projects.css';
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
        let username=sessionStorage.getItem('username');

        axios.get('/get_projects_by_username?username='+username).then(res => {
            let data = res.data
            this.setState({projects : data.projects})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    deleteProject(project_id){
        console.log(project_id);
        
        fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
        .then( res => res.json())
        .then(data=>{
            console.log("data",data);
            if(!data.success)
                alert("Project cannot be deleted because the folder or a file in it is open.")
            else{
                this.setState({ status: 'Deleted successful' })
                window.location.reload();
            }
                
            }
        )


    }

    handleSubmit(project_id){
        sessionStorage.setItem("U_project_id",project_id);

        axios.get('/get_project_by_projectId?project_id='+project_id).then(res => {
            let data = res.data
            // this.setState({project : data.models, script:script_id})
            if(data.success && data.project.model_loc!==null){
                window.open('http://localhost:8888/notebooks/'+data.project.model_loc);
            }
            else
                this.props.history.push("/scripts");


        })

    }

    render(){
        console.log("inside Project", this.state.projects);

        return(
            <div class="projects-row row">
                <div class="column hv-center"> 
                    <CreateProject/>       
                </div>
                {
                    this.state.projects.map(project => (       
                    <div class="column hv-center">           
                        <div className="projects hv-center">
                            <div className="mt-5 card">
                                <div className="inner-card" onClick={()=>this.handleSubmit(project.project_id)}>
                                    <div className="projects-details">
                                        <img src={project_icon} alt=""/>
                                        <div className="project-created-by">
                                            <span>
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
                                            {project.timestamp} 
                                                
                                            </span>
                                        </div>
                                    </div>
                                    <div className="project-title">
                                        <span><a href="/project">{project.title}</a></span>
                                    </div>
                                    <div className="project-description">
                                        <span>{project.description}
                                        {/* {project.description.length>80 &&
                                        <span>...
                                            </span>
                                        } */}
                                        
                                        </span>
                                    </div>
                                </div>
                  
                                <div className="project-footer">
                                    <span onClick={()=>{ if (window.confirm('Are you sure you wish to delete this project?')) this.deleteProject(project.project_id) } }>
                                        <i class="fa fa-trash-o" aria-hidden="true"/></span>
                                    <span>
                                        <i class="fa fa-share-alt" aria-hidden="true"/>
                                    </span>
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