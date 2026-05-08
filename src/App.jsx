import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddOrganization from "./pages/AddOrganization";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PasswordSetup from "./pages/PasswordSetup";
import VerifyOrganization from "./pages/VerifyOrganization";
import ViewOrganizations from "./pages/ViewOrganizations";
import ManageUsers from "./pages/ManageUsers";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { authService } from "./api/auth";

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function SuperAdminRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  const isSuperAdmin = authService.isSuperAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/add-organization"
          element={
            <ProtectedRoute>
              <Header />
              <AddOrganization />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password" element={<PasswordSetup />} />
        <Route path="/organizations/verify" element={<VerifyOrganization />} />
        <Route
          path="/view-organizations"
          element={
            <SuperAdminRoute>
              <Header />
              <ViewOrganizations />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute>
              <Header />
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <Header />
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:userId"
          element={
            <ProtectedRoute>
              <Header />
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Header />
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
