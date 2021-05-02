import React, {useState} from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import Scripts from './components/Scripts/Scripts';
import NotebookComponent from './components/NotebookComponent/NotebookComponent'

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
  Route
} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent'; 

function App() {
  console.log(sessionStorage.getItem("username"));
  if(localStorage.getItem("username")){
    sessionStorage.setItem('access_token', localStorage.getItem('access_token'));
    sessionStorage.setItem('refresh_token', localStorage.getItem('refresh_token'));
    sessionStorage.setItem('email', localStorage.getItem('email'));
    sessionStorage.setItem('username', localStorage.getItem('username'));
  }
  const [state , setState] = useState({
      username:sessionStorage.getItem("username")
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
              <Home/>}
            </Route>
            <Route path="/login">
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1} />
              {state.username===null &&
              <LoginForm/>}
              {state.username!==null &&
              <Home/>}
            </Route>
            <Route path="/projects">
              {state.username===null &&
              <LoginForm/>}
              {state.username!==null &&
              <Projects/>}
            </Route>
            <Route path="/scripts">
              {state.username===null &&
              <LoginForm/>}
              {state.username!==null &&
              <Scripts/>}
            </Route>
            <Route path="/platform">
              {state.username===null &&
              <NotebookComponent/>}
              {state.username!==null &&
              <NotebookComponent/>}
            </Route>
            <Route path="/home">
            <BackgroundSlider images={[ image1, image2,image4,image5,image6,image7 ]}
          duration={10} transition={1} />
              <Home/>
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
