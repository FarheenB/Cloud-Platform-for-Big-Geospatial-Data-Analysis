import React from 'react'
import './AdminComponent.css'
import project_icon from "../../static/images/logo4.svg"

import axios from 'axios';

class AddModels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            description:"", 
            scriptId:"", 
            scriptsCategories:[],  
            // codeURL:"",
            model_code:"",
            errors:{
              form:""
            },
            success:false
        };
        this.handleUploadFile = this.handleUploadFile.bind(this);
    }
    
    getScripts(){
        axios.get('/get_scripts_type').then(res => {
            let data = res.data
            this.setState({scriptsCategories : data.scriptsCategories})
        })
    }
    
    componentDidMount(){
        this.getScripts();
    }

    handleUploadFile(ev) {
        ev.preventDefault();
    
        // const data = new FormData();
        // data.append('file', this.uploadInput.files[0]);
        // let url='/upload?fileType=models'
        // fetch(url, {
        //     method: 'POST',
        //     body: data
        // }).then( res => res.json())
        // .then(data=>{
        //     this.setState({ codeURL: `${data['path']}`});
        //     // console.log(`http://localhost:5000/${data['path']}`);
        //   });

    }

    handleChange = (e) => {
        console.log("Inside create Model",this.state);
        this.state.errors.form="";
        if(e.target.files){
            this.setState({model_code:URL.createObjectURL(e.target.files[0])})
        }
        const {id , value} = e.target   
        this.setState(prevState => ({
            ...prevState,
            [id] : value
        }))
        console.log(this.uploadInput.files[0])

    }
    
    handleSubmit = (event) => {
        event.preventDefault(event);
    
        let url = "/add_model"
        let formData  = new FormData();
        formData.append('file', this.uploadInput.files[0]);


        console.log(this.state)
        let data = this.state;
        for(let name in data) {
            formData.append(name, data[name]);
        }

        let err=false;
        for(let name in data) {
            if(data[name]===""){
                err=true;
                let error={
                    form:"All fields are required"
                };
               
                this.setState({name:this.state.name, description:this.state.description, scriptId:this.state.scriptId, scriptsCategories:this.state.scriptsCategories, errors: error, success:this.state.success});
                break;
            }
        }
      
        console.log(this.state);
        if(!err){
            fetch(url, {
                method: 'POST',
                body: formData
            }).then( res => res.json())
            .then(data=>{
                if(data.success){
                this.setState({name:this.state.name, description:this.state.description, scriptId:this.state.scriptId, scriptsCategories:this.state.scriptsCategories, errors: this.state.errors, success:this.state.success}); 
                    // console.log("Success---",this.state);
                    // if(sessionStorage.getItem('admin'))
                        window.location.replace("/admin_");
                    // else
                    //         window.location.replace("/scripts");

                }
    
    
            }).catch(err => console.log(err));
      
        }
      
      }

    render() {
        return (
            <div className="login hv-center">
                <div className="admin-add-card card">
                    <div className="create-script-title">
                        <h4>Create New Model</h4>
                    </div>
                    <div className="admin-inner-card card col-12 col-lg-3">
                    <form autoComplete="off">
                         <div className="form-group logo">
                            <label for="codeFile">Model Code:</label>
                            <input className="code-upload" ref={(ref) => { this.uploadInput = ref; }} type="file" accept=".ipynb, .py" onChange={this.handleChange}/>
                            {
                                this.state.model_code &&
                                <a href={this.state.model_code}> <img className="code-display" src={project_icon} alt="Model Code"/></a>
                            }
                        </div>

                        {/* <div className="form-group create-script-button">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                onClick={this.handleUploadFile}
                                disabled={this.state.codeURL.length>0}
                            >Upload</button>
                        </div> */}
                        {/* <div className="form-group">
                            {this.state.codeURL.length>0 &&
                            <span class='text-success'>Code uploaded successfully</span>
                            }
                        </div> */}

                        <div className="form-group">
                            {/* <label for="scriptId">Select script category</label> */}
                            
                            <select name="scriptId" id="scriptId" class='form-control' onChange={this.handleChange} placeholder="Select script category">
                            <option value='-1'>Select script category</option>
                            {
                                this.state.scriptsCategories.map(script => (  
                                <option value={script.script_id}>{script.name}</option>
                                ))
                            }
                            </select>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Script Name"
                                onChange={this.handleChange}

                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                cols="10" rows="5"
                                placeholder="Script Description"
                                onChange={this.handleChange}

                            />
                        </div>
                        <div className="form-group create-project-button">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                onClick={this.handleSubmit}
                            >Submit</button>
                            
                        </div>
                        {this.state.errors.form.length > 0 && 
                            <div class="form-error">
                            <span className='error'>{this.state.errors.form}</span>
                            </div>
                        } 
                    </form>
                </div>
            </div>
            </div>

        );
    }
}

export default AddModels;