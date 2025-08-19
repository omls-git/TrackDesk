import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import '../styles/Header.css';
import { useEffect, useState } from 'react';
import ClientSelectModal from './ClientSelectModal';
import { useGlobalData } from '../services/GlobalContext';
import { getInitials } from '../Utility';
import ToolTipOverlay from './ToolTipOverlay';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [show, setShow] = useState(false);
  const [clientName, setClientName] = useState('');
  const [user, setUser] = useState([]);
  const initials = getInitials(localStorage.getItem('userName'));
  const {allClients, currentClientId, isAdmin, isManager, users} = useGlobalData(); 
  useEffect(() => {
    if(currentClientId){
      const client = allClients.find((client) => client.id.toString() === currentClientId.toString())
      if (client) setClientName(client.name);
    }
    const userEmail = localStorage.getItem('userEmail')
    const currentUser = users.filter((user) => user.email === userEmail.toString());
    
    if (currentUser && currentUser.length > 0) {
      setUser(currentUser);
    }
  },[allClients, currentClientId, users])

  const handleClientClick = (client) => {
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
        {
          isAdmin ?
        <div className="d-flex d-sm-none ms-auto align-items-center order-2">
          <NavLink
            className={({ isActive }) => (isActive ? 'active ' : '') + 'me-2'}
            to="/admin"
          >
            Admin
          </NavLink>
          <span className="profile" >{initials}</span>
        </div> : null 
        }
        <Navbar.Collapse id="responsive-navbar-nav" className="order-3">
           {
              clientName ? (
                <h6
                  className="clientName me-2 mb-2 mb-lg-0"
                  onClick={handleClientClick}                  
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
            {
              isAdmin || isManager ? 
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'mb-2 mb-lg-0 nav-item nav-link'}
              to="/all-cases"
              
            >
              All Cases
            </NavLink> : null
            }
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'mb-2 mb-lg-0 nav-item nav-link'}
              to="/my-cases"
              
            >
              My Cases
            </NavLink>
            {
              isAdmin || isManager ?
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/triage-cases"
            >
              Triage Cases
            </NavLink> : null
            }
            {
              currentClientId && allClients && allClients.find((client) => client.id.toString() === currentClientId)?.name?.toLowerCase() === "cipla" ? 
              <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/book-in"              
            >
              Book In
            </NavLink> : null
            }
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/employees"              
            >
              Employee Tracker
            </NavLink>
          </Nav>
          <Nav className="ms-auto align-items-center d-none d-sm-flex nav-tabs">            
          {
            isAdmin ?
            <NavLink
              className={({ isActive }) => (isActive ? 'active ' : '') + 'nav-item nav-link'}
              to="/admin"              
            >
              Admin
            </NavLink>
            : null }
            <span className="profile" >
              <ToolTipOverlay initials={initials} />
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {
        isAdmin || (user && user.length > 1) ?
          <ClientSelectModal open={show} onSelect={handleClientClick} onClose={handleClientClick} /> : null
      }
    </Navbar>
  );
};

export default Header;


