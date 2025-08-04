import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import '../styles/Header.css'; 
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import ClientSelectModal from './ClientSelectModal';
import { useGlobalData } from '../services/GlobalContext';
import { getInitials } from '../Utility';
import ToolTipOverlay from './ToolTipOverlay';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const { accounts } = useMsal();
  const [show, setShow] = useState(false);
  const [clientName, setClientName] = useState('');
  const [user, setUser] = useState([]);
  const initials = accounts.length > 0 ? getInitials(accounts[0].name) : '';
  const {allClients, currentClientId, isAdmin, users} = useGlobalData(); 
  useEffect(() => {
    localStorage.setItem("userName", accounts[0].name);
    localStorage.setItem("userEmail", accounts[0].username);
    if(currentClientId){
      const client = allClients.find((client) => client.id.toString() === currentClientId.toString())
      if (client) setClientName(client.name);
    }
    const currentUser = users.filter((user) => user.email === accounts[0].username);
    if (currentUser && currentUser.length > 0) {
      setUser(currentUser);
    }
  },[accounts, allClients, currentClientId, users])

  const handleModalClick = (client) => {
    setShow(!show);
    if(client && typeof client === 'number'){
      localStorage.setItem("currentClient", client);
      window.location.reload();
    }    
  }

  return (
    <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="order-1" />
        <div className="d-flex d-sm-none ms-auto align-items-center order-2">
          <NavLink
            className={({ isActive }) => (isActive ? 'active ' : '') + 'me-2'}
            to="/admin"
          >
            Admin
          </NavLink>
          <span className="profile" >{initials}</span>
        </div>
        <Navbar.Collapse id="responsive-navbar-nav" className="order-3">
           {
              clientName ? (
                <h6
                  className="clientName me-2 mb-2 mb-lg-0"
                  onClick={handleModalClick}                  
                >
                  {clientName?.toLocaleUpperCase()}
                </h6>
              ) : null
            }
          <Nav className="me-auto nav nav-tabs">
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'mb-2 mb-lg-0 nav-item nav-link'}
              to="/"
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'mb-2 mb-lg-0 nav-item nav-link'}
              to="/all-cases"
              
            >
              All Cases
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'mb-2 mb-lg-0 nav-item nav-link'}
              to="/my-cases"
              
            >
              My Cases
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/traige-cases"
            >
              Triage Cases
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/employees"              
            >
              Employee Tracker
            </NavLink>
          </Nav>
          <Nav className="ms-auto align-items-center d-none d-sm-flex nav-tabs">
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/admin"
              
            >
              Admin
            </NavLink>
            <span className="profile" >
              <ToolTipOverlay initials={initials} account={accounts[0]} />
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {
        isAdmin || (user && user.length > 1) ?
          <ClientSelectModal open={show} onSelect={handleModalClick} onClose={handleModalClick} /> : null
      }
    </Navbar>
  );
};

export default Header;


