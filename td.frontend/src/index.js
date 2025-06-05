import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

export const msalInstance = new PublicClientApplication(msalConfig);

async function main() {
  try {
    await msalInstance.initialize(); // ✅ REQUIRED
    await msalInstance.handleRedirectPromise(); // ✅ REQUIRED for loginRedirect()
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('MSAL Initialization error:', error);
  }
}
main();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


