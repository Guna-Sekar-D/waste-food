import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import LoginUser from './components/LoginUser';
import FoodDonate from './components/FoodForm';
import ViewFood from './components/FoodList';
import CreateUser from './components/CreateUser';
import DonatorDashboard from './components/DonatorDashboard';

// ProtectedRoute component
const ProtectedRoute = ({ children, roleRequired }) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  const getUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return decodedToken.role;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const userRole = getUserRole();
  if (userRole !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Signup and Login */}
        <Route path="/signup-admin" element={<AdminSignup />} />
        <Route path="/login-admin" element={<AdminLogin role="admin" />} />

        {/* Donator and Receiver Login */}
        <Route path="/login-donator" element={<LoginUser role="donator" />} />
        <Route path="/login-receiver" element={<LoginUser role="receiver" />} />
        <Route path="/donator-dashboard" element={<DonatorDashboard />} />

        {/* Protected Routes */}
        <Route
          path="/create-user"
          element={
            <ProtectedRoute roleRequired="admin">
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donator/food-donate"
          element={
            <ProtectedRoute roleRequired="donator">
              <FoodDonate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receiver/view-food"
          element={
            <ProtectedRoute roleRequired="receiver">
              <ViewFood />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

