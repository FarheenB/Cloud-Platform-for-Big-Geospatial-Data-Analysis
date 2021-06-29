import React from 'react'
import './AdminComponent.css'

class AddScripts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // imageURL: "",
            name:"",
            description:"",  
            logo:"",  
            errors:{
              form:""
            },
            success:false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleUploadImage(ev) {
        ev.preventDefault();
    
    //     const data = new FormData();
    //     data.append('file', this.uploadInput.files[0]);
    //     let url='/upload?fileType=images'
    //     fetch(url, {
    //         method: 'POST',
    //         body: data
    //     }).then( res => res.json())
    //     .then(data=>{
    //         this.setState({ imageURL: `${data['path']}`});
    //         // console.log(`http://localhost:5000/${data['path']}`);
    //       });

      }

    handleChange = (e) => {
        console.log("before Inside create Script",this.state);
        this.state.errors.form="";
        if(e.target.files){
            this.setState({logo:URL.createObjectURL(e.target.files[0])})
        }
        console.log("after logo--",this.state)
        const {id , value} = e.target   
        this.setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    
    handleSubmit = (event) => {
        event.preventDefault(event);
    
        let url = "/add_script"
        let formData  = new FormData();
        formData.append('file', this.uploadInput.files[0]);

        console.log(formData)

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
               
                this.setState({name:this.state.name, description:this.state.description, errors: error, success:this.state.success});
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
                    this.setState({name:this.state.name, description:this.state.description, errors: this.state.errors, success:data.success});
    
    
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
                        <h4>Create New Script</h4>
                    </div>
                    <div className="admin-inner-card card col-12 col-lg-3">

                    <form autoComplete="off">                       
                        <div className="form-group logo">
                            <label for="imageFile">Script Logo:</label>
                            <input className="logo-upload" ref={(ref) => { this.uploadInput = ref; }} type="file" accept=".jpg, .jpeg, .png" onChange={this.handleChange}/>
                            {
                                this.state.logo &&
                                <a href={this.state.logo}><img className="logo-display" src={this.state.logo} alt="Script Logo"/></a>
                            }
                        </div>

                        {/* <div className="form-group create-script-button">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                onClick={this.handleUploadImage}
                                disabled={this.state.imageURL.length>0}
                            >Upload</button>
                        </div>
                        <div >
                            {this.state.imageURL.length>0 &&
                            <img src={"../"+this.state.imageURL} alt="img" class="logo-upload"/>
                            }
                        </div> */}
                        {/* {
                            this.state.logo &&
                            <div className="logo-display">
                                <img src={this.state.logo} alt="Script Logo"/>
                            </div>
                        } */}
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

export default AddScripts;