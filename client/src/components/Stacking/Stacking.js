import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import CreateProject from "../CreateProject/CreateProject"
import project_icon from "../../static/images/project-icon.png"
import { format } from 'date-fns'
import { Date } from 'prismic-reactjs';
import './Stacking.css';
import ProgressBar from '../ProgressbarComponent/ProgressbarComponent';
import CircularProgress from '@material-ui/core/CircularProgress'

class Stacking extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            datasets:[],
            bands:[],
            filename:'stacked_image',
            uploading:false,

        };
        console.log("In stacking");
        this.handleInputChange = this.handleInputChange.bind(this)


    }

    getData(){
        axios.get('/get_dataset_by_projectId?project_id='+sessionStorage.getItem('U_project_id')).then(res => {
            let data = res.data
            this.setState({datasets : data.dataset})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        // let cur_bands=this.state.bands;
        // this.state.bands.append(value);
        console.log("---state--",this.state)

        this.setState({bands:this.state.bands.concat(value)})
        console.log("---state--",this.state)
    }

    handleSubmit = (event) => {
        event.preventDefault(event);
    
        // if(this.state.filename===''){
        //     this.setState({form_error:"Specify the filename by which you want to access the stacked image!"});
        // }
    
      
        // let dataset=acceptedFiles[0];
        // let datasetType=dataset.type.split('/')[0];
    
        // sessionStorage.setItem("U_dataset",dataset);
        // console.log("dataset",dataset);
        // history.push('/select_target?script='+script+'&model='+model+'&dataset='+datasetType);
        // else{
            this.setState({uploading:true});

            let model=sessionStorage.getItem("U_model");
            let script=sessionStorage.getItem("U_script");

            let url = "/perform_stacking"
            let formData  = new FormData();
        
            formData.append('filename', this.state.filename);
            formData.append('dataset_ids', this.state.bands);
            console.log(formData);    
    
            fetch(url, {
                method: 'POST',
                body: formData
            }).then( res => res.json())
            .then(data=>{
                if(data.success){
                    sessionStorage.setItem("U_dataset",data['filename']);
    
                    this.props.history.push('/start_model?script='+script+'&model='+model+'&dataset='+this.state.filename);           
    
                }
    
    
            }).catch(err => console.log(err));
        
            // }
        }
        

    render(){
        console.log("inside Stacking");

        return(
            <div class="autoML models">
                <ProgressBar active='4'/>
                <div class="heading hv-center">
                    <span>
                        <h4></h4>
                    </span>
                </div>

                {/* <div>
                    <input type="text"
                        className="filename"
                        id="filename"
                        placeholder="Enter stacked filename"    
                    /> 
                </div> */}
                <div className="stacking">
                    <div className="stacking_info">
                        <span>
                        Layer stacking is the process for combining multiple images into a single image. 
                        All the images/bands of same spatial resolution are used to perform layer stacking. 
                        However, combining images/bands will increase the final stacked image size, and consequently 
                        will increase the processing time later when you do your analysis. If you know that 
                        you will not use all the images/bands in your analysis, then it will be better to not 
                        stack all the images into a single image, and choose only specific images of interest. 
                        It depends on the purpose/objectives of your study.
                        </span>
                    </div>

                    <div className="">
                        <label for="bands">Select the images/bands to perform stacking:</label>
                        {
                            this.state.datasets.map(dataset => (
                                <div>
                                <input type="checkbox" className="checkbox" value={dataset.id} onChange={this.handleInputChange} />
                                <label for={dataset.id}> {dataset.file_name}</label>
                                </div>

                            ))
                        }
                    </div>
                </div>
                <div class="models-row row hv-center">
                    <div class="columns hv-center mt-4"> 
                        <div className="form-group create-script-button">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                onClick={this.handleSubmit}
                                disabled={this.state.bands.length===0 || this.state.uploading}
                            >{this.state.uploading?"Stacking...":"Perform Stacking"}</button>
                        </div>
                    </div>
                </div>  
                { 
                    this.state.uploading &&
                    <div className="progressbar">
                        <CircularProgress color="inherit"/>;
                    </div>
                }
                <div className="mt-5"></div>

            </div>     
        );
    }
}

export default withRouter(Stacking);