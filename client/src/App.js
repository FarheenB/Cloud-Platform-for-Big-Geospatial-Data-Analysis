import React, {useState} from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import CreateProject from './components/CreateProject/CreateProject';
import PrivateRoute from './utils/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent'; 
function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
    <div className="App">
      <NavBar/>
        <div className="container d-flex align-items-center flex-column container-size">
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>

          <Switch>
            <Route path="/" exact={true}>
              <Home/>
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/projects">
              <Projects showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/home">
              <Home/>
            </Route>
            <Route path="/create_project">
              <CreateProject/>
            </Route>
          </Switch>
        </div>
        <Footer/>
    </div>
    </Router>
  );
}

export default App;
