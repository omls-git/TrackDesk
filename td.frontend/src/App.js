import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AllCases from './pages/AllCases';
import MyCases from './pages/MyCases';
import Employeetracker from './pages/Employeetracker';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/all-cases" element={<AllCases />} />
            <Route path="/my-cases" element={<MyCases />} />
            <Route path="/employees" element={<Employeetracker />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
