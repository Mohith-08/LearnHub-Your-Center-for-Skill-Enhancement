
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AddCoursePage from './pages/AddCoursePage';

const ProtectedRoute: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  
  const { user } = authContext;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const TeacherRoute: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user } = authContext;
  return user && user.role === 'Teacher' ? <Outlet /> : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/course/:courseId" element={<CoursePage />} />
                <Route element={<TeacherRoute />}>
                    <Route path="/add-course" element={<AddCoursePage />} />
                </Route>
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
