import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import { store, persistor } from './store';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Users/UserManagement';
import ContentManagement from './pages/Content/ContentManagement';
import WeeklyContentPage from './pages/Content/WeeklyContentPage';
import TrimesterPage from './pages/Content/TrimesterPage';
import Settings from './pages/Settings';

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="staff">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content"
            element={
              <ProtectedRoute requiredRole="staff">
                <ContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/weekly/create"
            element={
              <ProtectedRoute requiredRole="staff">
                <WeeklyContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/weekly/:id/edit"
            element={
              <ProtectedRoute requiredRole="staff">
                <WeeklyContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/weekly/:id/view"
            element={
              <ProtectedRoute requiredRole="staff">
                <WeeklyContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/trimester/create"
            element={
              <ProtectedRoute requiredRole="staff">
                <TrimesterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/trimester/:id/edit"
            element={
              <ProtectedRoute requiredRole="staff">
                <TrimesterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregnancy-tracker/content/trimester/:id/view"
            element={
              <ProtectedRoute requiredRole="staff">
                <TrimesterPage />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
          <ToastContainer />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;