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
            <Route path="categories">
              <Route index element={<CategoryPage />} />
              <Route path="add" element={<CategoryForm />} />
              <Route path="edit/:id" element={<CategoryForm mode="edit" />} />
            </Route>
            <Route path="users">
              <Route index element={<UserPage />} />
              <Route path="add" element={<UserForm mode="add" />} />
              <Route path="edit/:id" element={<UserForm mode="edit" />} />
            </Route>
            <Route path="newsArticles">
              <Route index element={<NewsPage />} />
              <Route path="add" element={<NewsArticlesForm mode="add" />} />
              <Route path="edit/:id" element={<NewsArticlesForm mode="edit" />} />
              <Route path=":id" element={<NewsDetailPage />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
