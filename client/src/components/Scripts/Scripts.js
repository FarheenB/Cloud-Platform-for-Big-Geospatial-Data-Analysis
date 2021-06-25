import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import '../Projects/Projects.css';
import '../Scripts/Scripts.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';

import { withRouter } from "react-router-dom";

class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            scripts:[]
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSkip = this.handleSkip.bind(this)

    }

    getData(){
        axios.get('/get_scripts').then(res => {
            let data = res.data
            this.setState({scripts : data.scripts})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    handleSubmit(script_id, script_name){
        console.log(script_id);
        console.log(script_name);
        sessionStorage.setItem("U_script_id",script_id);
        this.props.history.push("/models?script="+script_name);
    }

    handleSkip(){ 
        sessionStorage.setItem("U_script_id",null);
        sessionStorage.setItem("U_model_id",null);
        console.log(this.props.history)
        this.props.history.push("/upload_dataset");
    }
    // deleteProject(project_id){
    //     console.log(project_id);
    //     fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
    //     .then(() => this.setState({ status: 'Deleted successful' }));

    //     window.location.reload();

    // }

    render(){
        return(
            <div class="autoML scripts">
                <ProgressBar active='1' handleSkip={this.handleSkip}/>
                <div class="heading hv-center">
                    <span>
                        <h4>WHAT KIND OF PROBLEM ARE YOU TRYING TO SOLVE?</h4>
                    </span>
                </div>

                <div class="algo-row row hv-center">   
                {
                    this.state.scripts.map(script => ( 
                    <div class="column hv-center">           
                        <div className="algo hv-center">  
                            <div className="mt-5 card">
                                <div className="inner-card" onClick={()=>this.handleSubmit(script.script_id,script.name)}>
                                    <div className="algo-details">
                                    <img src={script.logoURL} alt=""/>                                        
                                        <div className="algo-title">
                                        <span><a>{script.name}</a></span>
                                        </div>
                                        <div className="algo-description">
                                        <span>
                                        {script.description}
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
                    ))}
                </div>
            </div>
                     
        );
    }
}

export default withRouter(Scripts);