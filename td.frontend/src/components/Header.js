import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import '../styles/Header.css'; 
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import ClientSelectModal from './ClientSelectModal';
import { useGlobalData } from '../services/GlobalContext';
import { userInitials } from '../Utility';
import ToolTipOverlay from './ToolTipOverlay';

const Header = () => {
  const { accounts } = useMsal();
  const [show, setShow] = useState(false);
  const [clientName, setClientName] = useState('')
  const pathName = window.location.pathname;
  const initials = accounts.length > 0 ? userInitials(accounts[0].name) : '';
  const {allClients, currentClientId, isAdmin} = useGlobalData(); 
  useEffect(() => {
    localStorage.setItem("userName", accounts[0].name);
    localStorage.setItem("userEmail", accounts[0].username);
    if(currentClientId){
      const client = allClients.find((client) => client.id.toString() === currentClientId.toString())
      if (client) setClientName(client.name);
    }
  },[accounts, allClients, currentClientId])

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
          <Nav.Link
            as={Button}
            variant="outline-light"
            className={(pathName === "/admin" ? "active": "") + " me-2"}
            href="/admin"
          >
            Admin
          </Nav.Link>
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
          <Nav className="me-auto">
            <Nav.Link
              as={Button}
              variant="outline-light"
              className={(pathName === "/" ? "active": "") + " me-2 mb-2 mb-lg-0"}
              href="/"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Button}
              variant="outline-light"
              className={(pathName === "/all-cases" ? "active": "") + " me-2 mb-2 mb-lg-0"}
              href="/all-cases"
              
            >
              All Cases
            </Nav.Link>
            <Nav.Link
              as={Button}
              variant="outline-light"
              className={(pathName === "/my-cases" ? "active": "") + " me-2 mb-2 mb-lg-0"}
              href="/my-cases"
              
            >
              My Cases
            </Nav.Link>
            <Nav.Link
              as={Button}
              variant="outline-light"
              className={(pathName === "/employees" ? "active": "") + " me-2 mb-2 mb-lg-0"}
              href="/employees"
              
            >
              Employee Tracker
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center d-none d-sm-flex">
            <Nav.Link
              as={Button}
              variant="outline-light"
              className={(pathName === "/admin" ? "active" : "") + " me-2"}
              href="/admin"
              
            >
              Admin
            </Nav.Link>
            <span className="profile" >
              <ToolTipOverlay initials={initials} account={accounts[0]} />
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {
        isAdmin ?
          <ClientSelectModal open={show} onSelect={handleModalClick} onClose={handleModalClick} /> : null
      }
    </Navbar>
  );
};

export default Header;


