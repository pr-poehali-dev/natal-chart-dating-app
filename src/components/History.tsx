import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface HistoryItem {
  id: number;
  name: string;
  compatibility: number;
  date: string;
  sign: string;
  initials: string;
  status: 'viewed' | 'liked' | 'matched';
}

const historyData: HistoryItem[] = [
  {
    id: 1,
    name: 'Александра',
    compatibility: 94,
    date: '2 часа назад',
    sign: '♓',
    initials: 'АЛ',
    status: 'matched'
  },
  {
    id: 2,
    name: 'Дмитрий',
    compatibility: 87,
    date: '5 часов назад',
    sign: '♉',
    initials: 'ДМ',
    status: 'liked'
  },
  {
    id: 3,
    name: 'Елена',
    compatibility: 81,
    date: 'вчера',
    sign: '♏',
    initials: 'ЕЛ',
    status: 'viewed'
  }
];

export default function History() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Взаимно</Badge>;
      case 'liked':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Понравилось</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border/30">Просмотрено</Badge>;
    }
  };

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent animate-float">
            История
          </h1>
          <p className="text-muted-foreground text-lg">
            Твои последние взаимодействия
          </p>
        </div>

        <div className="space-y-4">
          {historyData.map((item) => (
            <Card
              key={item.id}
              className="glow border-primary/30 bg-card/80 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xl font-semibold">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="text-2xl">{item.sign}</span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Heart" size={14} className="text-primary" />
                        <span className="font-semibold text-primary">{item.compatibility}% совместимость</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glow border-muted/30 bg-card/80 backdrop-blur-sm text-center p-8">
          <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Конец истории. Продолжай искать свою идеальную пару!
          </p>
        </Card>
      </div>
    </div>
  );
}
