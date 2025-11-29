import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Container } from "react-bootstrap";

const Layout = (props) => {
  return (
    <>
      <Header/>

      <main>
        <Container className="my-4">
          <Outlet />
        </Container>
      </main>

      <Footer/>
    </>
  );
};

export default Layout;
