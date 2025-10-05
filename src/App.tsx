import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import BookDetail from './components/BookDetail';
import AddBook from './components/AddBook';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route
              path="/add-book"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}
