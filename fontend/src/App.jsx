import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Layout from "./components/layout/Layout";
import CategoryPage from "./pages/CategoryPage";
import Home from "./pages/Home";
import CategoryForm from "./components/specific/CategoryForm";
import UserPage from "./pages/UserPage";
import NewsPage from "./pages/NewsPage";
import NewsArticlesForm from "./components/specific/NewsArticlesForm";
import Forbidden from "./pages/Forbidden";
import Logout from "./pages/Logout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import NewsDetailPage from "./pages/NewsDetailPage";
import UserForm from "./components/specific/UserForm";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import MinioTestPage from "./pages/MinioTestPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/logout" element={<Logout />} />

          {/*  Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />

            {/* Categories: STAFF & ADMIN */}
            <Route path="categories" element={
              <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <CategoryPage />
              </ProtectedRoute>
            } />
            <Route path="categories/add" element={
              <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <CategoryForm />
              </ProtectedRoute>
            } />
            <Route path="categories/edit/:id" element={
              <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <CategoryForm mode="edit" />
              </ProtectedRoute>
            } />

            {/* Users: ADMIN only */}
            <Route path="users" element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path="users/add" element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <UserForm mode="add" />
              </ProtectedRoute>
            } />
            <Route path="users/edit/:id" element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <UserForm mode="edit" />
              </ProtectedRoute>
            } />

            <Route path="newsArticles">
              <Route index element={
                <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                  <NewsPage />
                </ProtectedRoute>} />
              <Route path="add" element={
                <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                  <NewsArticlesForm mode="add" />
                </ProtectedRoute>
              } />
              <Route path="edit/:id" element={
                <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                  <NewsArticlesForm mode="edit" />
                </ProtectedRoute>
              } />
              <Route path=":id" element={<NewsDetailPage />} />
            </Route>

            <Route path="/profile" element={
              <ProtectedRoute roles={["ROLE_USER", "ROLE_STAFF", "ROLE_ADMIN"]}>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <HistoryPage />
              </ProtectedRoute>
            } />

            <Route path="/minio-test" element={
              <ProtectedRoute roles={["ROLE_STAFF", "ROLE_ADMIN"]}>
                <MinioTestPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
