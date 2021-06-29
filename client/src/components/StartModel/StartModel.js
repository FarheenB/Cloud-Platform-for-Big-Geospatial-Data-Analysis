import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';
import './StartModel.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';

class StartModel extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            models:[],
            script:""
        };
        console.log("In target");

    }

    // handleSubmit(){
    //     let url='/create_user_model';

    //     fetch(url, {
    //         method: 'POST',
    //         body: formData
    //     }).then( res => res.json())
    //     .then(data=>{
    //         if(data.success){
    //         this.setState({name:this.state.name, description:this.state.description, scriptId:this.state.scriptId, scriptsCategories:this.state.scriptsCategories, errors: this.state.errors, success:this.state.success}); 
    //             // console.log("Success---",this.state);
    //             // if(sessionStorage.getItem('admin'))
    //                 window.location.replace("/admin_");
    //             // else
    //             //         window.location.replace("/scripts");

    //         }


    //     }).catch(err => console.log(err));



    //     console.log(this.props.location.search);
    //     let search=this.props.location.search;
    //     let query=queryString.parse(search)
    //     console.log(query);
   
    //     sessionStorage.setItem("U_script",query.script);
    //     sessionStorage.setItem("U_model",query.model);
        
    //     axios.get('/get_models_by_scriptName?script='+query.script).then(res => {
    //         let data = res.data
    //         this.setState({models : data.models, script:query.script})
    //     })
    // }
    
    // componentDidMount(){
        
    // }

    handleSubmit(){
        let project_id=sessionStorage.getItem("U_project_id");
        let model_id=sessionStorage.getItem("U_model_id");
        let script_id=sessionStorage.getItem("U_script_id");
        let datasetURL=sessionStorage.getItem("U_datasetURL");
        let username=sessionStorage.getItem("username");


        let url="/set_project_model";
        let formData  = new FormData();
        let data={
            "project_id": project_id,
            "model_id":model_id,
            "script_id":script_id,
            "datasetURL":datasetURL,
            "username":username
        };

        for(let name in data) {
            formData.append(name, data[name]);
        }

        fetch(url,{
            method: 'POST',
            body: formData

        }).then(res=>res.json())
        .then(data=>{
            console.log("start data===",data);
            if(data.success){
                window.open('http://localhost:8888/notebooks/'+data.project.model_loc); 
                window.location.replace("/projects");

            }
        });
        // console.log("---props",this.props);
        // this.props.history.push("/projects");

    }

    render(){
        console.log("inside Start");

        return(
            <div class="autoML models">
                <ProgressBar active='5'/>
                {/* <div class="heading hv-center">
                    <span>
                        <h4>Start</h4>
                    </span>
                </div> */}
                
                <div class="start-model-row row hv-center">
                    <div class="columns hv-center"> 
                        <span className="heading">
                            Let's start the model
                        </span>
                    </div>
                    <div class="columns hv-center"> 
                        <div className="form-group create-script-button">
                            <div 
                                className="start"
                                onClick={this.handleSubmit}
                            ><i class="fa fa-angle-double-right" aria-hidden="true"></i></div>
                    </div>
                    </div>
                </div>  
                <div className="mt-5"></div>

            </div>     
        );
    }
}

export default withRouter(StartModel);