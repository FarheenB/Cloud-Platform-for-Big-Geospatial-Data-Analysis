import React, {useState} from 'react';
import './LoginForm.css';
import { withRouter } from "react-router-dom";

const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
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
        rememberMe:false,
        errors:{
            email : "",
            password : "",
            form : ""
        }
    })
    const handleChange = (e) => {
        state.errors.form="";
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
                  : 'Invalid email address';
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
                state.errors.form="All fields are required";
                setState({email:state.email, password:state.password, rememberMe:state.rememberMe, errors: state.errors});
                break;
            }
        }

        console.log("state===",state);
        if(validateForm(state.errors) && !err){
            fetch(url, {
                method: 'POST',
                body: formData
            }).then( res => res.json())
            .then(data=>{
                console.log("data===",data);                
                if (data.access_token && data.access_token !== null && data.access_token!=="undefined")
                {
                    sessionStorage.setItem('access_token', data.access_token);
                    sessionStorage.setItem('refresh_token', data.refresh_token);
                    sessionStorage.setItem('email', data.email);
                    sessionStorage.setItem('username', data.username);
                    if(state.rememberMe){
                        localStorage.setItem('access_token', data.access_token);
                        localStorage.setItem('refresh_token', data.refresh_token);
                        localStorage.setItem('email', data.email);
                        localStorage.setItem('username', data.username);
                        localStorage.setItem('rememberMe', state.rememberMe);
                    }
                    window.location.replace("/projects");
                }
                else{   
                    console.log("error")
                    console.log(data)

                    state.errors.form=data.error;
                }
                setState({email:state.email, password:state.password, errors: state.errors});


            }).catch(err => console.log(err));
        }
    }
      
    // const redirectToHome = () => {
    //     // props.showError(null)
    //     props.history.push('/home');
    // }
    const redirectToRegister = () => {
        // props.showError(null)
        props.history.push('/register'); 
    }

    const {errors} = state;
    
    return(
        <div className="login hv-center">
            <div className="card col-12 col-lg-3 hv-center">
                 <div className="login-title">
                    <h4>LOGIN</h4>
                 </div>
                <form className="login-form" > 
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
                    <div className="remember-me-checkbox">
                        <input type="checkbox" id="rememberMe" name="remember" value="true" onChange={handleChange} />
                        <label for="remember">Remember me</label>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={handleLogin}
                    >Login</button>
                
                
                <div className="forgot-password"><a>Forgot Password?</a></div>

                <div className="register-message">
                    <span>Dont have an account? </span>
                    <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
                </div>
                
                {errors.form.length > 0 && 
                    <div class="form-error">
                        <span className='error'>{errors.form}</span>
                    </div>
                }

                </form>
         </div>
         </div>
        
    )
}

export default withRouter(LoginForm);