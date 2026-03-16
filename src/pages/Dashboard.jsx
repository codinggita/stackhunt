import { useAuth } from '../context/AuthContext';
import DeveloperDashboard from './DeveloperDashboard';
import { Navigate } from 'react-router-dom';

import CompanyDashboard from './CompanyDashboard';
import MaintainerDashboard from './MaintainerDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  // Dynamic dashboard based on role
  switch (user.role) {
    case 'developer':
      return <DeveloperDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'maintainer':
      return <MaintainerDashboard />;
    default:
      return <DeveloperDashboard />;
  }
};

export default Dashboard;
