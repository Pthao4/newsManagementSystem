// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { authAPI } from "../api/authAPI";

// export default function LoginForm() {

//   const navigate = useNavigate();
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     const email = event.target.formBasicEmail.value;
//     const password = event.target.formBasicPassword.value;

//     try {
//       const data = await authAPI.login(email, password);
//       console.log(data);
//       navigate("/");
//     } catch (error) {
//       console.error("Error login:", error);
//     }
//   }

//   return (
//     <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <Row className="w-100">
//         <Col xs={12} sm={10} md={6} lg={4} className="mx-auto">
//           <Card className="p-4 shadow-lg rounded-4 border-0">
//             <h3 className="text-center mb-4 text-primary fw-bold">
//               FUNews Management
//             </h3>

//             {/* Login Form */}
//             <Form onSubmit={handleLogin}>
//               <Form.Group className="mb-3" controlId="formBasicEmail">
//                 <Form.Label className="fw-semibold">Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter your email"
//                   className="rounded-3"
                  
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3" controlId="formBasicPassword">
//                 <Form.Label className="fw-semibold">Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Enter your password"
//                   className="rounded-3"
                  
//                 />
//               </Form.Group>

//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <Form.Check type="checkbox" label="Remember me" />
//                 <a href="#" className="text-decoration-none small text-primary">
//                   Forgot password?
//                 </a>
//               </div>

//               <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold rounded-3" onClick={() => handleLogin}>
//                 Login
//               </Button>
//             </Form>

//             {/* Link chuyển sang Sign Up */}
//             <p className="text-center mt-3 mb-0">
//               Don’t have an account?{" "}
//               <Link to="/register" className="text-decoration-none fw-semibold text-success">
//                 Sign Up
//               </Link>
//             </p>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/authAPI";
import { useAuth } from "../context/useAuth"; // ✅ Thêm dòng này

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Lấy hàm login từ AuthContext

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    try {
      const data = await authAPI.login(email, password);

      // ✅ Lưu token và cập nhật user context
      if (data?.token) {
        login(data.token);
        navigate("/");
      } else {
        console.error("No token found in response:", data);
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col xs={12} sm={10} md={6} lg={4} className="mx-auto">
          <Card className="p-4 shadow-lg rounded-4 border-0">
            <h3 className="text-center mb-4 text-primary fw-bold">
              FUNews Management
            </h3>

            {/* ✅ Login Form */}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-3"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  className="rounded-3"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember me" />
                <a href="#" className="text-decoration-none small text-primary">
                  Forgot password?
                </a>
              </div>

              {/* ❌ Bỏ onClick — chỉ cần submit */}
              <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold rounded-3">
                Login
              </Button>
            </Form>

            {/* Link chuyển sang Sign Up */}
            <p className="text-center mt-3 mb-0">
              Don’t have an account?{" "}
              <Link to="/register" className="text-decoration-none fw-semibold text-success">
                Sign Up
              </Link>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
