import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';
import queryString from 'query-string';
import './Models.css';

class Models extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            models:[],
            status:""
        };
        console.log("In model");

    }

    getData(){
        console.log(this.props.location.search);
        let search=this.props.location.search;
        let query=queryString.parse(search)
        console.log(query.script);

        axios.get('/get_models_by_scriptName?script='+query.script).then(res => {
            let data = res.data
            this.setState({models : data.models})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    render(){
        console.log("inside Model", this.state.models);

        return(
            <div class="models-row row hv-center">
                <div class="columns hv-center"> 
                <div class="heading"><h4>Select an algorithm</h4></div>
                {
                    this.state.models.map(model => ( 
                    <div>
                        
                        <div class="hoverDiv hv-center" >{model.name}</div>
                        <div class="hiddenText">{model.description}</div>
                    </div>))
                }
                </div>
            </div>         
        );
    }
}

export default withRouter(Models);