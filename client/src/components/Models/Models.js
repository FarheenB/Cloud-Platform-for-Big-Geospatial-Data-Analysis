import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import './Models.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';
import queryString from 'query-string';

class Models extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            models:[],
            script:""
        };
        console.log("In model");
        this.handleSkip = this.handleSkip.bind(this)


    }

    getData(){
        console.log(this.props.location.search);
        let script_id=sessionStorage.getItem("U_script_id");

        axios.get('/get_models_by_scriptId?script_id='+script_id).then(res => {
            let data = res.data
            this.setState({models : data.models, script:script_id})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    handleSubmit(model_id, model_name){
        sessionStorage.setItem("U_model_id",model_id);

        let search=this.props.location.search;
        let query=queryString.parse(search);
        this.props.history.push("upload_dataset/?script="+query.script+"&model="+model_name);
    }

    handleSkip(){ 
        sessionStorage.setItem("U_model_id",null);
        this.props.history.push("/upload_dataset");
    }
    
    render(){
        console.log("inside Model", this.state.models);

        return(
            <div class="autoML models">
                <ProgressBar active='2' handleSkip={this.handleSkip}/>
                {/* <div class="heading hv-center">
                    <span>
                        <h4>SELECT THE MODEL</h4>
                    </span>
                </div> */}
            
                <div class="models-row row hv-center">
                    <div class="columns hv-center mt-4"> 
                    {
                        this.state.models.map(model => ( 
                        <div onClick={()=>this.handleSubmit(model.model_id,model.name)}>
                            {/* <a href={"/upload_dataset?script="+this.state.script+"&model="+model.name}> */}
                            <div class="hoverDiv hv-center" >{model.name}</div>
                            <div class="hiddenText">{model.description}</div>
                            {/* </a> */}
                        </div>))
                    }
                    </div>
                </div>                      
            </div>     
        );
    }
}

export default withRouter(Models);