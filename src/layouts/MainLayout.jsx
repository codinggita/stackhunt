import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
