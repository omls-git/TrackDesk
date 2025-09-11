// src/App.js
import React from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginRequest, msalConfig } from './authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
export const msalInstance = new PublicClientApplication(msalConfig);

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    await msalInstance.initialize();
    try {
      const loginResponse = await instance.loginPopup(loginRequest);

      if (loginResponse) {
        const userEmail = loginResponse.account.username;
        const userName = loginResponse.account.name;
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
      }
    } catch (err) {
      console.error("Login error: ", err);
    }
  };

  return (
    <div className="text-center">
      <button className="btn btn-light shadow-sm p-3 d-flex align-items-center justify-content-center"
        onClick={handleLogin}
      >
        <img src='./microsoft.png' alt='microsoftlogo' style={{ width: "28px", marginRight: 10 }} />
        <span style={{ fontWeight: '600' }}>Sign in with Microsoft</span>
      </button>
    </div>
  )
};

const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect(); // or logoutPopup()
  };

  return <button className="btn btn-outline-dark mt-3" onClick={handleLogout}>Sign Out</button>;
};

function Login() {
  const isAuthenticated = useIsAuthenticated();

    return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      {/* Container */}
      <div 
        className="d-flex shadow-lg rounded-4 overflow-hidden" 
        style={{ width: "70%", height: "60%", backgroundColor: "#ffffff" }}
      >
        
        {/* Left Side */}
        <div 
          className="d-flex flex-column justify-content-center align-items-center w-50 p-4" 
          style={{ backgroundColor: "#f0f6ff" }} // very light blue background
        >
          <div 
            className="text-center p-4 rounded-4"
            style={{ 
              backgroundColor: "#e6f0ff", // soft pastel blue
              color: "#003366", // dark navy text for contrast
              boxShadow: "0px 8px 25px rgba(0,0,0,0.15)"
            }}
          >
            <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>SAFE TRACK</h1>
            <p className="mt-2 mb-0">Track. Manage. Secure.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="d-flex flex-column justify-content-center align-items-center w-50 bg-white p-4">
          <h1 className="fw-bold" style={{ fontSize: "2.0rem", color: "#003366" }}>Login</h1>
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>
    </div>
  );
}
export default Login;
