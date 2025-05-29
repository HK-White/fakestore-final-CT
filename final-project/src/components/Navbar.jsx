import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function NavigationBar() {
  const [expanded, setExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      bg="light"
      expand="md"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="py-3 navbar shadow-sm"
    >
      <Container>
        {/* Logo/Brand on the left */}
        <Navbar.Brand as={Link} to="/">
          <h1 className="m-0 navbrand">ALT STORE</h1>
        </Navbar.Brand>

        {/* Hamburger menu for mobile */}
        <Navbar.Toggle aria-controls="responsive-navbar" />

        {/* Navigation links in the middle */}
        <Navbar.Collapse
          id="responsive-navbar"
          className="justify-content-center text-center"
        >
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin">
              Admin
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Button on the right - hidden on small screens */}
        {windowWidth >= 768 && (
          <Button
            variant="primary"
            className="rounded-pill ms-md-3"
            as={Link}
            to="/products"
          >
            Products
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
