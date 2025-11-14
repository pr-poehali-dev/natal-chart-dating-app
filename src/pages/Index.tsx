import { useState, useEffect } from 'react';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
import History from '@/components/History';
import Chats from '@/components/Chats';
import Settings from '@/components/Settings';
import Navigation from '@/components/Navigation';
import Auth from '@/components/Auth';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'profile' | 'search' | 'history' | 'chats' | 'settings'>('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const sessionToken = localStorage.getItem('session_token');
    const userId = localStorage.getItem('user_id');
    
    if (sessionToken && userId) {
      setIsAuthenticated(true);
      setUserData({ user_id: parseInt(userId) });
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full cosmic-gradient star-field flex items-center justify-center">
        <div className="text-accent text-2xl animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile />;
      case 'search':
        return <Search />;
      case 'history':
        return <History />;
      case 'chats':
        return <Chats />;
      case 'settings':
        return <Settings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen w-full pb-20">
      {renderPage()}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;