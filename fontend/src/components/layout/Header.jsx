import Navbars from "../common/Navbars";
import Search from "../common/Search";
import { Container, Row, Col, Image } from "react-bootstrap";
import logo from "../../assets/images/logo/logo.jpg";

export default function Header() {
  return (
    <header className="bg-dark shadow-sm py-2">
      <Container fluid>
        <Row className="align-items-center">
          {/* Logo
          <Col xs={12} md={2} className="text-center text-md-start mb-2 mb-md-0">
            <Image src={logo} alt="Logo" height="40" rounded />
          </Col> */}

          {/* Navbar */}
          <Col xs={12} md={12} className="mb-2 mb-md-0">
            <Navbars />
          </Col>

          {/* Search */}
          {/* <Col xs={12} md={3}>
            <Search />
          </Col> */}
        </Row>
      </Container>
    </header>
  );
}
