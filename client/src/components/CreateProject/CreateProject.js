import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import './CreateProject.css';
import { Container } from './CreateProjectContainer';



function CreateProject(props) {
    const [state,setState]=useState({
      errors:"",
      success:false,
      newProject:{}
    });
 

  const handleChange = (e) => {
    console.log("Inside create Proj",state);
    state.errors="";
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault(event);
    console.log("Event----",event);
    // console.log(event.target.description.value);
    let title=event.target.title.value;
    let description=event.target.description.value;
    let username=sessionStorage.getItem('username');

      let url = "/create_project"
      let formData  = new FormData();
      let data={
      "title": title,
      "description": description,
      "username": username
    };

   
      let err=false;
      // for(let name in data) {
          if(title===""){
              err=true;
              state.errors="Title is required";
              const {id , value} = event.target   
              setState(prevState => ({
                  ...prevState,
                  [id] : value
              }))
              console.log("Errors----",state);
              // break;
          }
      // }
  
      for(let name in data) {
        formData.append(name, data[name]);
      }

      console.log(state);
      if(!err){
        fetch(url, {
            method: 'POST',
            body: formData
        }).then( res => res.json())
        .then(data=>{
          // console.log("data",data);
          if(!data.success)
            state.errors="Invalid entry";
            state.newProject=data.new_project;
            state.success=data.success;
          const {id , value} = event.target   
            setState(prevState => ({
                ...prevState,
                [id] : value
            }))
          // setState({errors: state.errors, newProject:data.new_project, success:data.success});

          console.log("Success---",state);
          window.location.reload();


        }).catch(err => console.log(err));
  
    }
  
  };

  return(
       
    <Container handleChange={handleChange} onSubmit={onSubmit} errors={state.errors}/>

      
        
      

        
    )
}

export default withRouter(CreateProject);
