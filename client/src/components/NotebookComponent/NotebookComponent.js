import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';
// import './Models.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';
// import MarkdownRender from './MarkdownRender';

class Notebook extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            models:[],
            script:""
        };
        console.log("In target");

    }

    getData(){
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
    }
    
    componentDidMount(){
        window.open('static/models/Untitled.ipynb?kernel_name=python3');
    }

    render(){
        console.log("inside SelectTarget");

    return(
            // return <MarkdownRender />
                <div class="heading hv-center">
                    <span>
                        <a href='http://localhost:8888/notebooks/Untitled.ipynb?kernel_name=python3' target="_blank"><h4>DISPLAY NOTEBOOK</h4></a>
                    </span>
                    {/* <iframe src='http://localhost:8888/notebooks/Untitled.ipynb?kernel_name=python3' title="Jupyter Notebook"> */}

                    {/* </iframe> */}
                </div>
    );
              
        
    }
}

export default withRouter(Notebook);