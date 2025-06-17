import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import '../styles/Header.css'; 
import { useMsal } from '@azure/msal-react';

const Header = () => {
  // You can use the window.location object as an alternative
  const { accounts } = useMsal();
  const pathName = window.location.pathname;
  const userName = accounts.length > 0 ? accounts[0].name : 'User Name';
  return (
    <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="order-1" />
        <div className="d-flex d-sm-none ms-auto align-items-center order-2">
          <Nav.Link as={Button} variant="outline-light" className={(pathName === "/admin" ? "active": "")+ " me-2" }href="/admin">Admin</Nav.Link>
          <span className="profile">{userName}</span>
        </div>
        <Navbar.Collapse id="responsive-navbar-nav" className="order-3">
          <Nav className="me-auto">
            <Nav.Link as={Button} variant="outline-light" className={(pathName === "/" ? "active": "") + " me-2 mb-2 mb-lg-0"} href="/">Dashboard</Nav.Link>
            <Nav.Link as={Button} variant="outline-light" className={(pathName === "/all-cases" ? "active": "") + " me-2 mb-2 mb-lg-0"} href="/all-cases">All Cases</Nav.Link>
            <Nav.Link as={Button} variant="outline-light" className={(pathName === "/my-cases" ? "active": "") + " me-2 mb-2 mb-lg-0"} href="/my-cases">My Cases</Nav.Link>
            <Nav.Link as={Button} variant="outline-light" className={(pathName === "/employees" ? "active": "") + " me-2 mb-2 mb-lg-0"} href="/employees">Employee Tracker</Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center d-none d-sm-flex">
            <Nav.Link as={Button} variant="outline-light" className={(pathName === "/admin" ? "active" : "") + " me-2"} href="/admin">Admin</Nav.Link>
            <span className="profile">{userName}</span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;


