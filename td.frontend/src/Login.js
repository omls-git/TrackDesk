// src/App.js
import React from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginRequest, msalConfig } from './authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
export const msalInstance = new PublicClientApplication(msalConfig);


export const SignInButton = () => {
  const {instance} = useMsal();
  const handleLogin = async() => {
    await msalInstance.initialize();
    try{
     const loginResponse = await instance.loginPopup(loginRequest)

      if(loginResponse){
        const userEmail = loginResponse.account.username;
        const userName = loginResponse.account.name
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
      }
    } catch(err){
      console.error("Login error: ", err);
    }
    
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-4" onClick={handleLogin}>
      <button className="btn btn-dark  shadow-sm p-3">
      <img src='./microsoft.png' alt='microsoftlogo' style={{width:"30px", marginRight:10}} />
        <span style={{ fontWeight: 'bold' }}>Sign in with Microsoft</span>
      </button>
    </div>
  )
};

const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect(); // or logoutPopup()
  };

  return <button onClick={handleLogout}>Sign Out</button>;
};



function Login() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div>
      <h1>Microsoft Login</h1>
      {isAuthenticated ? <SignOutButton /> : <SignInButton />}      
    </div>
  );
}

export default Login;
