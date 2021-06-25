import React from 'react'
import './AdminComponent.css'
import axios from 'axios';

class AdminComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            users:[],
            scripts:[],
            models:[],
            projects:[],
            status:""
        };
    }

    getData(){
        axios.get('/get_users').then(res => {
            let data = res.data
            this.setState({users : data.users})
        })

        axios.get('/get_scripts').then(res => {
            let data = res.data
            this.setState({scripts : data.scripts})
        })

        axios.get('/get_models').then(res => {
            let data = res.data
            this.setState({models : data.models})
        })

        axios.get('/get_projects').then(res => {
            let data = res.data
            this.setState({projects : data.projects})
        })
    }
    
    componentDidMount(){
        this.getData();
    }

    deleteUser(user_id){
        console.log(user_id);
        fetch('/delete_user?user_id='+user_id, { method: 'DELETE' })
        .then(() => this.setState({ status: 'Deleted successful' }));

        window.location.reload();

    }

    deleteScript(script_id){
        console.log(script_id);
        fetch('/delete_script?script_id='+script_id, { method: 'DELETE' })
        .then(() => this.setState({ status: 'Deleted successful' }));

        window.location.reload();

    }

    deleteModel(model_id){
        console.log(model_id);
        fetch('/delete_model?model_id='+model_id, { method: 'DELETE' })
        .then(() => this.setState({ status: 'Deleted successful' }));

        window.location.reload();

    }

    deleteProject(project_id){
        console.log(project_id);
        
        fetch('/delete_project?project_id='+project_id, { method: 'DELETE' })
        .then( res => res.json())
        .then(data=>{
            console.log("data",data);
            if(!data.success)
                alert("Project cannot be deleted because the folder or a file in it is open.")
            else{
                this.setState({ status: 'Deleted successful' })
                window.location.reload();
            }
                
            }
        )
    }

    render(){
        return(
            <div class="admin">
            <div class="row admin-page hv-center">
                <div class="col-lg-6 col-md-12">
                    <div class="admin-card card">
                        <div class="card-header card-header-info">
                        <h4 class="card-title">Registered Users</h4>
                        <p class="card-category">All the users registered on this platform</p>
                        </div>
                        <div class="card-body table-responsive">
                            <table class="table table-hover">
                                <thead class="text-info">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                this.state.users.map(user => (     
                                    <tr>
                                        <th scope="row">{user.user_id}</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-sm px-3" onClick={()=>this.deleteUser(user.user_id)}>
                                                <i class="fa fa-times"/>
                                            </button>
                                        </td>
                                    </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row admin-page">
                <div class="col-lg-6 col-md-12">
                    <div class="admin-card card">
                        <div class="card-header card-header-info">
                        <h4 class="card-title">Scripts</h4>
                        <p class="card-category">All the pre-modeled scripts</p>
                        </div>
                        <div class="card-body table-responsive">
                            <table class="table table-hover">
                                <thead class="text-info">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Logo</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                        this.state.scripts.map(script => (     
                            <tr>
                                <th scope="row">{script.script_id}</th>
                                <td><img class="logo-display" src={script.logoURL} alt="Script Logo"/></td>
                                <td>{script.name}</td>
                                <td>{script.description}</td>
                                <td>
                                    <button type="button" class="btn btn-danger btn-sm px-3" onClick={()=>this.deleteScript(script.script_id)}>
                                        <i class="fa fa-times"/>
                                    </button>
                                </td>
                            </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    
                    </div>
                    </div>
                    <div>
                        <a href='/admin/add_scripts'>
                    <button type="submit" 
                            className="btn btn-primary admin-btn"
                            >Add Script</button></a>

                    </div>
                </div>

                <div class="col-lg-6 col-md-12">
                    <div class="admin-card card">
                        <div class="card-header card-header-info">
                        <h4 class="card-title">Models</h4>
                        <p class="card-category">All the pre-modeled algorithms</p>
                        </div>
                        <div class="card-body table-responsive">
                            <table class="table table-hover">
                                <thead class="text-info">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Type</th>
                                <th scope="col">Model</th>
                                <th scope="col">Description</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                        this.state.models.map(model => (     
                            <tr>
                                <th scope="row">{model.model_id}</th>
                                <td><a href={model.code_path}><i class="fa fa-file fa-2x" aria-hidden="true"></i></a> </td>
                                <td>{model.script_name}</td>
                                <td>{model.name}</td>
                                <td>{model.description}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm px-3" onClick={()=>this.deleteModel(model.model_id)}>
                                        <i class="fa fa-times"/>
                                    </button>
                                </td>
                            </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    
                    </div>
                    </div>
                    <div>
                    <a href='/admin/add_models'>
                        <button type="submit" 
                            className="btn btn-primary admin-btn"
                            >Add Model</button></a>
                    </div>
                </div>

                <div class="row admin-page hv-center">
                <div class="col-md-12">
                    <div class="admin-card card">
                        <div class="card-header card-header-info">
                        <h4 class="card-title">Projects</h4>
                        <p class="card-category">All the projects created on this platform</p>
                        </div>
                        <div class="card-body table-responsive">
                            <table class="table table-hover">
                                <thead class="text-info">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Script</th>
                                        <th scope="col">Model</th>
                                        <th scope="col">Project</th>
                                        <th scope="col">Dataset</th>
                                        <th scope="col">Created by</th>
                                        <th scope="col">Created on</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                this.state.projects.map(project => (     
                                    <tr>
                                        <th scope="row">{project.project_id}</th>
                                        <td>{project.title}</td>
                                        <td>{project.description}</td>
                                        <td>{project.script}</td>
                                        <td>{project.model}</td>
                                        <td>{project.model_loc}</td>
                                        <td>{project.dataset_loc}</td>
                                        <td>{project.created_by}</td>
                                        <td>{project.created_on}</td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-sm px-3" onClick={()=>this.deleteProject(project.project_id)}>
                                                <i class="fa fa-times"/>
                                            </button>
                                        </td>
                                    </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            </div>
            </div>
        );
    }
}
export default AdminComponent;
