import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  currentPage: 'profile' | 'search' | 'history' | 'chats' | 'settings';
  onNavigate: (page: 'profile' | 'search' | 'history' | 'chats' | 'settings') => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'profile' as const, icon: 'UserCircle', label: 'Профиль' },
    { id: 'search' as const, icon: 'Search', label: 'Поиск' },
    { id: 'history' as const, icon: 'Clock', label: 'История' },
    { id: 'chats' as const, icon: 'MessageCircle', label: 'Чаты' },
    { id: 'settings' as const, icon: 'Settings', label: 'Настройки' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300',
                currentPage === item.id
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              )}
            >
              <Icon
                name={item.icon as any}
                size={24}
                className={cn(
                  'transition-all duration-300',
                  currentPage === item.id && 'drop-shadow-[0_0_8px_rgba(155,135,245,0.5)]'
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {currentPage === item.id && (
                <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
