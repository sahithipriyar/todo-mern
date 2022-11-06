import axios from "axios";
import {React, useRef} from "react";
import { useNavigate } from "react-router-dom";
// import { PersonIcon } from '@mui/icons-material';

import "./Login.css"
const Login = (props)=>{

    const {setuserCookie, userCookie } = props;
    const usernameElementRef = useRef();
    const passwordElementRef = useRef();
    const errorMessageElementRef = useRef();
    const navigate = useNavigate();


    const handleLoginBtnClick=()=>{
        let username = usernameElementRef.current.value;
        let password = passwordElementRef.current.value;
        console.log(username, password)

        if(username!=="" && password!==""){
            errorMessageElementRef.current.style.opacity=0;
            axios({
                url: "http://localhost:3005/user/login",
                    method: "POST",
                    headers: {
                    },
                    data: { username: username, password: password }
                }).then(async(loginData) => {
                    console.log(loginData)
        
                    await setuserCookie("token", loginData.data.token, { path: "/" })
                    console.log(userCookie.token)
                    // if (userCookie.token !== "") {
                        navigate("/user/todolist")
                    // } else {
                    //     navigate("/")
                    // }
                
                }).catch((err) => {
                    window.alert(err.response.data.message)
                    console.log(err);
                })
        }
        else{
            if(!username.length){
                errorMessageElementRef.current.innerHTML="pls enter username"
                errorMessageElementRef.current.style.opacity=1;
            }
            else{
                errorMessageElementRef.current.innerHTML="pls enter password"
                errorMessageElementRef.current.style.opacity=1;
            }
        }
    }

    return(
        <div className="login-page-body" style={{height:"100vh", width:"100vw"}}>
            <div className="login-page-main-container">
                <div className="login-page-usericon-container"></div>
                <div className="login-page-member-login-name">Member Login</div>
                <input ref={usernameElementRef} className="login-page-input-username" type={"text"} placeholder={"Username"}></input>
                <input ref={passwordElementRef} className="login-page-input-password" type={"password"} placeholder={"Password"}></input>
                <div onClick={handleLoginBtnClick} className="login-page-btn-login">LOGIN</div>
                <div onClick={()=>{navigate("/register")}}className="login-page-register-link">Register</div>
                <div ref={errorMessageElementRef} className="login-page-error-message">message</div>
            </div>
            
        </div>
    )
}


export default Login;