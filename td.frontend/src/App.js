
import { AuthenticatedTemplate, UnauthenticatedTemplate} from '@azure/msal-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';


function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;