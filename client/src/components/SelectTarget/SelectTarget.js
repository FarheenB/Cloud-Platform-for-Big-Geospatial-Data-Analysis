import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter, useHistory } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';
import queryString from 'query-string';
// import './Models.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';

class SelectTarget extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            model:"",
            script:"",
            datasetType:""
        };

    }

    // getData(){

        // console.log(this.props.location.search);
        // let search=this.props.location.search;
        // let query=queryString.parse(search)
        // console.log(query);
   
        // sessionStorage.setItem("U_script",query.script);
        // sessionStorage.setItem("U_model",query.model);
        
        // axios.get('/get_models_by_scriptName?script='+query.script).then(res => {
        //     let data = res.data
        //     this.setState({models : data.models, script:query.script})
        // })

    // }
    
    componentDidMount(){
        console.log("2props===",this.props.location.search);
        
        let search=this.props.location.search;
        let query=queryString.parse(search);
        this.setState({script:query.script,model:query.model,datasetType:query.datasetType});
    }

    handleSubmit(){
        // let model=sessionStorage.getItem("U_model_id");
        // let script=sessionStorage.getItem("U_script__");
        // let datasetType=sessionStorage.getItem("U_datasetType");
       
        // this.props.history.push("upload_dataset/?script="+query.script+"model="+model_name);
    

        this.props.history.push('/start_model?script='+this.state.script+'&model='+this.state.model+'&dataset='+this.state.datasetType);
            
    }

    render(){
        console.log("inside SelectTarget");
        console.log("props===",this.props.location.search);

        return(
            <div class="autoML models">
                <ProgressBar active='4'/>
                <div class="heading hv-center">
                    <span>
                        <h4>SELECT TARGET</h4>
                    </span>
                </div>
            
                <div class="models-row row hv-center">
                    <div class="columns hv-center mt-4"> 
                    <div className="form-group create-script-button">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={this.handleSubmit}
                    >Proceed</button>
                </div>
                    </div>
                </div>  
                <div className="mt-5"></div>

            </div>     
        );
    }
}

export default withRouter(SelectTarget);