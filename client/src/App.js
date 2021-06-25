import React, {useState} from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Scripts from './components/Scripts/Scripts';
import Models from './components/Models/Models';
import UploadDataset from './components/UploadDataset/UploadDataset';
import SelectTarget from './components/SelectTarget/SelectTarget';
import StartModel from './components/StartModel/StartModel';


import NotebookComponent from './components/NotebookComponent/NotebookComponent'
import AdminComponent from './components/AdminComponent/AdminComponent';
import AddScripts from './components/AdminComponent/AddScripts';
import AddModels from './components/AdminComponent/AddModels';

import CreateProject from './components/CreateProject/CreateProject';
import PrivateRoute from './utils/PrivateRoute';


import BackgroundSlider from 'react-background-slider'

import image1 from './static/images/satellite-earth-imaging.png'
import image2 from './static/images/satellite-wildfire-imaging.png'
import image4 from './static/images/satellite-sea-imaging.png'
import image5 from './static/images/satellite-urban-imaging.png'
import image6 from './static/images/satellite-bushfire-imaging.png'
import image7 from './static/images/satellite-sprawling-imaging.png'




import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import AlertComponent from './components/AlertComponent/AlertComponent'; 

function App() {

  if(localStorage.getItem('access_token')!==null && localStorage.getItem("access_token")!=="undefined" && localStorage.getItem("rememberMe")){
    sessionStorage.setItem('access_token', localStorage.getItem('access_token'));
    sessionStorage.setItem('refresh_token', localStorage.getItem('refresh_token'));
    sessionStorage.setItem('email', localStorage.getItem('email'));
    sessionStorage.setItem('username', localStorage.getItem('username'));
  }

  // console.log(sessionStorage.getItem("access_token"));
  let sessionData=sessionStorage.getItem("access_token");
  let username=sessionData!==null && sessionData!=="undefined" ? sessionStorage.getItem("username"):null;

// ------Admin access
if(sessionData!==null && sessionData!=="undefined"){
  if(username==="Admin"){
    sessionStorage.setItem('admin',true)
  }
  else{
    sessionStorage.setItem('admin',false)
  }
}



  const [state , setState] = useState({
      username:username,
      admin:sessionStorage.getItem('admin')
  });

  return (
    <Router>
    <div className="App">
      <NavBar/>
        <div className="container d-flex align-items-center flex-column container-size">
          
          <Switch>
            <Route path="/" exact={true}>
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1}/>
              <Home/>
            </Route>
            <Route path="/register">
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1}/>
              {state.username===null &&
              <RegistrationForm/>}
              {state.username!==null &&
              <Redirect to='/home'  />}
            </Route>
            <Route path="/login">
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1} />
              {state.username===null &&
              <LoginForm/>}
              {state.username!==null &&
              <Redirect to='/home'  />}
            </Route>
            <Route path="/projects">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <Projects/>}
            </Route>
            <Route path="/scripts">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <Scripts/>}
            </Route>
            <Route path="/models">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <Models/>}
            </Route>
            <Route path="/upload_dataset">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <UploadDataset/>}
            </Route>
            <Route path="/select_target">
              {state.username===null &&              
              <Redirect to='/login'  />}
              {state.username!==null &&
              <SelectTarget/>}
            </Route>
            <Route path="/start_model">
              {state.username===null &&              
              <Redirect to='/login'  />}
              {state.username!==null &&
              <StartModel/>}
            </Route>
            <Route path="/notebook">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <NotebookComponent/>}
            </Route>
            <Route path="/platform">
              {state.username===null &&
              <Redirect to='/login'  />}
              {state.username!==null &&
              <NotebookComponent/>}
            </Route>
            <Route path="/home">
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1} />
              <Home/>
            </Route>

            {/* Only Admin Access */}
            <Route path="/admin_">
              {state.admin &&
              <AdminComponent/>}
              {!state.admin &&
              <div>
                <span>Access Denied</span>
              </div>}
            </Route>
            <Route path="/admin/add_scripts">
              {state.admin &&
              <AddScripts/>}
              {!state.admin &&
              <div>
                <span>Access Denied</span>
              </div>}
            </Route>
            <Route path="/admin/add_models">
              {state.admin &&
              <AddModels/>}
              {!state.admin &&
              <div>
                <span>Access Denied</span>
              </div>}
            </Route>

            {/* <Route path="/create_project">
              <CreateProject/>
            </Route> */}
          </Switch>
        </div>
        <Footer/>
    </div>
    </Router>
  );
}

export default App;
