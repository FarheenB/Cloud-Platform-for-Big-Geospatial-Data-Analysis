import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import '../Projects/Projects.css';
import '../Scripts/Scripts.css';

import { withRouter } from "react-router-dom";

class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            scripts:[]
        };
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

    // deleteProject(project_id){
    //     console.log(project_id);
    //     fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
    //     .then(() => this.setState({ status: 'Deleted successful' }));

    //     window.location.reload();

    // }

    render(){
        return(
            <div class="algo-row row hv-center">   
                 {
                    this.state.scripts.map(script => ( 
                <div class="column hv-center">           
                    <div className="algo hv-center">  

                        <div className="mt-5 card">
                        <Link to={"/models?script="+script.name}>

                            <div className="inner-card">

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
                            </Link>

                        </div>  
                                            
                    </div>
                </div>
                ))}
            </div>
                     
        );
    }
}

export default withRouter(Scripts);