"use client";
import { AuthenticatedTemplate, UnauthenticatedTemplate} from '@azure/msal-react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AllCases from './pages/AllCases';
import MyCases from './pages/MyCases';
import Employeetracker from './pages/Employeetracker';
import Admin from './pages/Admin';
import Login from './Login';
import TriageCases from './pages/TriageCases';
import BookIn from './pages/BookIn';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
  return (
    <div className="App">
      <AuthenticatedTemplate>
      <div className="main-content">
        <Router>
        <ErrorBoundary>
        <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/all-cases" element={<AllCases />} />
            <Route path="/my-cases" element={<MyCases />} />
            <Route path="/employees" element={<Employeetracker />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/triage-cases" element={<TriageCases />} />
            <Route path="/book-in" element={<BookIn />} />
          </Routes>
          </ErrorBoundary >
        </Router>
      </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;