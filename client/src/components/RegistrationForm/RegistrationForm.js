import React, {useState} from 'react';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

function RegistrationForm(props) {
    const [state , setState] = useState({
        username : "",
        email : "",
        password : "",
        confirmPassword : "",
        errors:{
            username : "",
            email : "",
            password : "",
            confirmPassword : "",
        }

    })

    const handleChange = (e) => {
        props.showError(null);
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))

        let errors=state.errors;

        switch (id) {
            case 'username': 
              errors.username = 
                value.length < 5
                  ? 'Username must be 5 characters long'
                  : '';
              break;
              case 'email': 
              errors.email = 
                validEmailRegex.test(value)
                  ? ''
                  : 'Email address is not valid';
              break;
            case 'password': 
              errors.password = 
                value.length < 8
                  ? 'Password must be 8 characters long'
                  : '';
              break;
              case 'confirmPassword': 
              errors.confirmPassword = 
                    id.password!==value
                  ? 'Passwords does not match'
                  : '';
              break;
            default:
              break;
          }
        }
    

    const handleRegister = (e) =>{
        e.preventDefault() ;

        let url = "/register"
        let formData  = new FormData();
        let data = state;
        for(let name in data) {
            formData.append(name, data[name]);
        }

        let err=false;
        for(let name in data) {
            if(data[name]===""){
                err=true;
                props.showError("All fields are required")
                break;
            }
        }

        if(validateForm(state.errors) && !err){
            fetch(url, {
                method: 'POST',
                body: formData
            }).then( res => res.json())
            .then(data=>{
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('email', data.email);
                localStorage.setItem('username', data.username);
        
            if (localStorage.getItem("access_token") !== null && localStorage.getItem("access_token")!=="undefined") {
                window.location.replace("/projects")
                props.showError(null)
            }
            else{
                props.showError(data.error);
            }
            }).catch(err => console.log(err));
        }
    }

    const redirectToHome = () => {
        props.showError(null);
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.showError(null);
        props.history.push('/login'); 
    }

    const {errors} = state;

    return(
        <div className="register hv-center">
            <div className="card col-12 col-lg-3 hv-center">
                <div className="register-title">
                    <h4>Register</h4>
                </div>
                <form className="register-form">
                    <div className="form-group text-left">
                        <input type="username" 
                            className="form-control" 
                            id="username" 
                            aria-describedby="usernameHelp" 
                            placeholder="Username" 
                            value={state.username}
                            onChange={handleChange}
                        />
                        {errors.username.length > 0 && 
                        <span className='error'>{errors.username}</span>}
                    </div>
                    <div className="form-group text-left">
                        <input type="email" 
                            className="form-control" 
                            id="email" 
                            aria-describedby="emailHelp" 
                            placeholder="E-mail address" 
                            value={state.email}
                            onChange={handleChange}
                        />
                        {errors.email.length > 0 && 
                        <span className='error'>{errors.email}</span>}
                    </div>
                    <div className="form-group text-left">
                        <input type="password" 
                            className="form-control" 
                            id="password" 
                            placeholder="Password"
                            value={state.password}
                            onChange={handleChange} 
                        />
                        {errors.password.length > 0 && 
                        <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="form-group text-left">
                        <input type="password" 
                            className="form-control" 
                            id="confirmPassword" 
                            placeholder="Confirm password"
                            value={state.confirmPassword}
                            onChange={handleChange} 
                        />
                        {errors.confirmPassword.length > 0 && 
                    <span className='error'>{errors.confirmPassword}</span>}
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </form>
                <div className="mt-2">
                    <span>Already have an account? </span>
                    <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
                </div>
            </div>    
        </div>
    )
}

export default withRouter(RegistrationForm);