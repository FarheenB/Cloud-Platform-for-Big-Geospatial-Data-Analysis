import React, { useState, useCallback } from "react";
import './UploadDataset.css';
import { withRouter } from "react-router-dom";
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';
import DropZone from './DropZone';
import queryString from 'query-string';

class UploadDataset extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            model:"",
            script:"",
            category:""
        };
        this.handleSkip = this.handleSkip.bind(this)

    }

    componentDidMount(){
        if(this.props.location){
        let search=this.props.location.search;
        let query=queryString.parse(search);
        let q_script=query.script;
        let q_model=query.model;
        this.state.model=q_model;
        this.state.script=q_script;

        // this.setState({script:query.script, model:query.model});
        this.setState({model : q_model, script:q_script})

        console.log("In upload",this.state, this.props.history);
        }

    }
    // onSubmit(){
    //     // this.props.push()
    //     console.log(this.state);
    // }
    // getData(){
    //     console.log(this.props.location.search);
    //     let search=this.props.location.search;
    //     let query=queryString.parse(search)
    //     console.log(query.script);

    //     axios.get('/get_models_by_scriptName?script='+query.script).then(res => {
    //         let data = res.data
    //         this.setState({models : data.models, script:query.script})
    //     })
    // }
    
    // componentDidMount(){
    //     this.getData();
    // }

    handleChange = (e) => {
        console.log("Inside create Model",this.state);
        // this.state.errors.form="";
        const {id , value} = e.target   
        this.setState(prevState => ({
            ...prevState,
            [id] : value
        }))
        // console.log(this.uploadInput.files[0])

    }

    handleSkip(){
        sessionStorage.setItem("U_datasetURL",null);
        this.props.history.push("/start_model");
    }

    render(){
        return(
            <div className="autoML upload-dataset">
            <ProgressBar active='3' handleSkip={this.handleSkip}/>
            <div className="form-group data-type">
                <select name="category" id="category" class='form-control' onChange={this.handleChange} placeholder="Select data category">
                    <option value=''>Select data category</option>
                    {/* {
                        this.state.scriptsCategories.map(script => (  
                        <option value={script.script_id}>{script.name}</option>
                        ))
                    } */}
                    <option value='Sentinel-2'>Sentinel-2</option>
                    <option value='Landsat-8'>Landsat-8</option>
                    
                </select>
            </div>
            <DropZone model={this.state.model} script={this.state.script} category={this.state.category}/>
            </div>

        );
    }
}
export default withRouter(UploadDataset);
