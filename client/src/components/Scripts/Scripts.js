import React, {useState} from 'react';
import axios from 'axios';
import '../Projects/Projects.css';
import '../Scripts/Scripts.css';

import { withRouter } from "react-router-dom";
import linear_regression_icon from "../../static/images/linear-regression-icon.png"
import binary_calssification_icon from "../../static/images/binary-classification-icon.png"
import clustering_icon from "../../static/images/clustering-icon.png"
import multi_classification_icon from "../../static/images/multi-classification-icon.png"

class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            scripts:[],
            status:""
        };
    }

    // getData(){
    //     let username=sessionStorage.getItem('username');

    //     axios.get('/get_projects?username='+username).then(res => {
    //         let data = res.data
    //         this.setState({projects : data.projects})
    //     })
    // }
    
    // componentDidMount(){
    //     this.getData();
    // }

    // deleteProject(project_id){
    //     console.log(project_id);
    //     fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
    //     .then(() => this.setState({ status: 'Deleted successful' }));

    //     window.location.reload();

    // }

    render(){
        // console.log("inside Project", this.state.projects);

        return(
            <div class="algo-row row hv-center">     
                <div class="column hv-center">           
                    <div className="algo hv-center">                    
                        <div className="mt-5 card">
                            <div className="inner-card">
                                <div className="algo-details">
                                <img src={linear_regression_icon} alt=""/>                                        
                                    <div className="algo-title">
                                    <span><a href="/algo">REGRESSION</a></span>
                                    </div>
                                    <div className="algo-description">
                                    <span>
                                    Predict a target (average) numeric value from your data. 
                                    </span>                 
                                </div>
                                <div className="algo-see-example">
                                    <span>See an example <i class="fa fa-angle-double-right"></i></span>
                                </div>
                                </div>
                            </div>
                        </div>                          
                    </div>
                </div>
                <div class="column hv-center">           
                    <div className="algo hv-center">                    
                        <div className="mt-5 card">
                            <div className="inner-card">
                                <div className="algo-details">
                                <img src={multi_classification_icon} alt=""/>                                        
                                    <div className="algo-title">
                                    <span><a href="/algo">MULTI CLASSIFICATION</a></span>
                                    </div>
                                    <div className="algo-description">
                                    <span>
                                    Predict a target class from a set of possible categories in your data. 
                                    </span>                 
                                </div>
                                <div className="algo-see-example">
                                    <span>See an example <i class="fa fa-angle-double-right"></i></span>
                                </div>
                                </div>
                            </div>
                        </div>                          
                    </div>
                </div>
                <div class="column hv-center">           
                    <div className="algo hv-center">                    
                        <div className="mt-5 card">
                            <div className="inner-card">
                                <div className="algo-details">
                                <img src={binary_calssification_icon} alt=""/>                                        
                                    <div className="algo-title">
                                    <span><a href="/algo">BINARY CLASSIFICATION</a></span>
                                    </div>
                                    <div className="algo-description">
                                    <span>
                                    Predict a target class from a set of two categories in your data. 
                                    </span>                 
                                </div>
                                <div className="algo-see-example">
                                    <span>See an example <i class="fa fa-angle-double-right"></i></span>
                                </div>
                                </div>
                            </div>
                        </div>                          
                    </div>
                </div>
                <div class="column hv-center">           
                    <div className="algo hv-center">                    
                        <div className="mt-5 card">
                            <div className="inner-card">
                                <div className="algo-details">
                                <img src={clustering_icon} alt=""/>                                        
                                    <div className="algo-title">
                                    <span><a href="/algo">CLUSTERING</a></span>
                                    </div>
                                    <div className="algo-description">
                                    <span>
                                    Predict a target cluster from a set of possible values in your data.  
                                    </span>                 
                                </div>
                                <div className="algo-see-example">
                                    <span>See an example <i class="fa fa-angle-double-right"></i></span>
                                </div>
                                </div>
                            </div>
                        </div>                          
                    </div>
                </div>

            </div>
                     
        );
    }
}

export default withRouter(Scripts);