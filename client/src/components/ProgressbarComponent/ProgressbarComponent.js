import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import '../Projects/Projects.css';
import '../Scripts/Scripts.css';
import './ProgressbarComponent.css'
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import queryString from 'query-string';
import arrow_right from "../../static/images/right-arrow.png";


class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            status:""
        };

    }

    // componentDidMount(){
    //     // let history = useHistory();
    //     // this.setState({history:history})
    //     let search=this.props.location.search;
    //     let query=queryString.parse(search);

    //     console.log(query);
    //     // sessionStorage.setItem("U_model_id",query.model);
    //     sessionStorage.setItem("U_datasetType",query.dataset);
    //     if(!query.dataset)
    //         sessionStorage.setItem("U_datasetURL",query.dataset);


    // }

    render(){
        console.log(this.props);
        return(
            <div class="progressbar-container ">
            <ul class="progressbar hv-center">
            
                {/* <li class={this.props.active==="2" || this.props.active==="3" || this.props.active==="4" || this.props.active==="5"?"active":this.props.active==="1"?"on":""}
                onClick={this.props.active==="2"?this.props.history.goBack :""}>
                    <span>Select Problem Type</span></li>

                <li class={this.props.active==="3" || this.props.active==="4" || this.props.active==="5"?"active":this.props.active==="2"?"on":""} 
                onClick={this.props.active==="3"?this.props.history.goBack:""}>
                    <span>Select Algorithm</span></li>

                <li class={this.props.active==="4" || this.props.active==="5"?"active":this.props.active==="3"?"on":""} 
                onClick={this.props.active==="4"?this.props.history.goBack:""}>
                    <span>Select/Add Data</span></li>

                <li class={this.props.active==="5"?"active":this.props.active==="4"?"on":""}
                onClick={this.props.active==="5"?this.props.history.goBack:""}>
                    <span>Select Mode/Target</span></li>

                <li class={this.props.active==="5"?"on":""}>
                    <span>Start</span></li> */}

                <li class={this.props.active==="2" || this.props.active==="3" || this.props.active==="4"?"active":this.props.active==="1"?"on":""}
                onClick={this.props.active==="2"?this.props.history.goBack :""}>
                    <span>Select Problem Type</span></li>

                <li class={this.props.active==="3" || this.props.active==="4" ?"active":this.props.active==="2"?"on":""} 
                onClick={this.props.active==="3"?this.props.history.goBack:""}>
                    <span>Select Algorithm</span></li>

                <li class={this.props.active==="4"?"active":this.props.active==="3"?"on":""} 
                onClick={this.props.active==="4"?this.props.history.goBack:""}>
                    <span>Select/Add Data</span></li>

                <li class={this.props.active==="4"?"on":""}>
                    <span>Start</span></li>
               
                {(this.props.active==="1" || this.props.active==="2" || this.props.active==="3") && 
                <div className="skip" onClick={this.props.handleSkip}>
                    <span>
                        Skip
                    </span>
                    <img src={arrow_right} alt='arrow right'></img>

                </div>
                }
                
            </ul>
            
        </div>
        );
    }
}

export default withRouter(ProgressBar);

      