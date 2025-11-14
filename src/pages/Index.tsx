import { useState } from 'react';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
import History from '@/components/History';
import Chats from '@/components/Chats';
import Settings from '@/components/Settings';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'profile' | 'search' | 'history' | 'chats' | 'settings'>('profile');

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