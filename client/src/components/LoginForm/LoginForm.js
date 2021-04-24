import React, {useState} from 'react';
import './LoginForm.css';
import { withRouter } from "react-router-dom";

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        errors:{
            email : "",
            password : ""
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
            case 'email': 
              errors.email = 
                validEmailRegex.test(value)
                  ? ''
                  : 'Email address is not valid';
              break;
            default:
              break;
          }
    }

    const handleLogin = e =>{
        e.preventDefault() ;

        let url = "/login"
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
        props.showError(null)
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.showError(null)
        props.history.push('/register'); 
    }

    const {errors} = state;
    
    return(
        <div className="login hv-center">
            <div className="card col-12 col-lg-3 hv-center">
                <div className="login-title">
                    <h4>Login</h4>
                </div>
                <form className="login-form"> 
                    <div className="form-group text-left">
                    <input type="email" 
                        className="form-control" 
                        id="email" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter email" 
                        value={state.email}
                        onChange={handleChange}
                    />
                    {errors.email.length > 0 && 
                    <span className='error'>{state.errors.email}</span>}
                    </div>
                    <div className="form-group text-left">
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange} 
                    />
                    {state.errors.password.length > 0 && 
                    <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="form-checkbox">
                        <input type="checkbox" id="remember" name="remember" value="remember"/>
                        <label for="remember">Remember me</label>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={handleLogin}
                    >Login</button>
                </form>
                
                <div className="registerMessage">
                    <span>Dont have an account? </span>
                    <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
                </div>
                <div className="forgot-password"><a href="/">Forgot Password</a></div>
            </div>
        </div>
    )
}

export default withRouter(LoginForm);