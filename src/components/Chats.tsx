import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  sign: string;
  initials: string;
  compatibility: number;
}

const chats: Chat[] = [
  {
    id: 1,
    name: 'Александра',
    lastMessage: 'Согласна, наша совместимость впечатляет! 😊',
    timestamp: '14:32',
    unread: 2,
    sign: '♓',
    initials: 'АЛ',
    compatibility: 94
  },
  {
    id: 2,
    name: 'Дмитрий',
    lastMessage: 'Привет! Давай встретимся?',
    timestamp: 'вчера',
    unread: 0,
    sign: '♉',
    initials: 'ДМ',
    compatibility: 87
  }
];

export default function Chats() {
  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent animate-float">
            Чаты
          </h1>
          <p className="text-muted-foreground text-lg">
            Общайся с теми, кто тебе интересен
          </p>
        </div>

        <div className="space-y-3">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className="glow border-primary/30 bg-card/80 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-lg font-semibold">
                        {chat.initials}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unread > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{chat.name}</h3>
                        <span className="text-xl">{chat.sign}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {chat.lastMessage}
                    </p>

                    <div className="flex items-center gap-1 text-xs">
                      <Icon name="Heart" size={12} className="text-primary" />
                      <span className="text-primary font-medium">{chat.compatibility}%</span>
                    </div>
                  </div>

                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {chats.length === 0 && (
          <Card className="glow border-muted/30 bg-card/80 backdrop-blur-sm text-center p-12">
            <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Пока нет чатов</h3>
            <p className="text-muted-foreground">
              Найди интересных людей в поиске и начни общение!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
