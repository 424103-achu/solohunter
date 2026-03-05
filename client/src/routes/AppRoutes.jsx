import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Main pages
import Dashboard from '../pages/Dashboard';
import QuestPage from '../pages/QuestPage';
import CodingChallenge from '../pages/CodingChallenge';
import Profile from '../pages/Profile';
import Leaderboard from '../pages/Leaderboard';
import FitnessChallenge from '../pages/FitnessChallenge';
import SkillTreePage from '../pages/SkillTreePage';
import InfoPage from '../pages/InfoPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quests" element={<ProtectedRoute><QuestPage /></ProtectedRoute>} />
      <Route path="/quest/:id" element={<ProtectedRoute><CodingChallenge /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/fitness" element={<ProtectedRoute><FitnessChallenge /></ProtectedRoute>} />
      <Route path="/skills" element={<ProtectedRoute><SkillTreePage /></ProtectedRoute>} />
      <Route path="/info" element={<ProtectedRoute><InfoPage /></ProtectedRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;