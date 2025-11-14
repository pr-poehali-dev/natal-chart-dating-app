import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface UserProfile {
  id: number;
  name: string;
  age: number;
  compatibility: number;
  sign: string;
  description: string;
  initials: string;
}

const mockUsers: UserProfile[] = [
  {
    id: 1,
    name: 'Александра',
    age: 28,
    compatibility: 94,
    sign: '♓',
    description: 'Творческая душа с интересом к философии',
    initials: 'АЛ'
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 32,
    compatibility: 87,
    sign: '♉',
    description: 'Любитель путешествий и астрологии',
    initials: 'ДМ'
  },
  {
    id: 3,
    name: 'Елена',
    age: 26,
    compatibility: 81,
    sign: '♏',
    description: 'Глубокая личность с развитой интуицией',
    initials: 'ЕЛ'
  },
  {
    id: 4,
    name: 'Максим',
    age: 30,
    compatibility: 76,
    sign: '♒',
    description: 'Свободный дух, интересуюсь эзотерикой',
    initials: 'МА'
  },
  {
    id: 5,
    name: 'Виктория',
    age: 27,
    compatibility: 72,
    sign: '♊',
    description: 'Общительная и любознательная',
    initials: 'ВИ'
  },
  {
    id: 6,
    name: 'Артём',
    age: 29,
    compatibility: 68,
    sign: '♐',
    description: 'Оптимист с тягой к приключениям',
    initials: 'АР'
  }
];

export default function Search() {
  const [users] = useState<UserProfile[]>(mockUsers);

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 90) return 'from-green-400 to-emerald-600';
    if (compatibility >= 80) return 'from-primary to-secondary';
    if (compatibility >= 70) return 'from-blue-400 to-cyan-600';
    return 'from-purple-400 to-pink-600';
  };

  const getCompatibilityLabel = (compatibility: number) => {
    if (compatibility >= 90) return 'Идеальная';
    if (compatibility >= 80) return 'Отличная';
    if (compatibility >= 70) return 'Хорошая';
    return 'Средняя';
  };

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent animate-float">
            Поиск
          </h1>
          <p className="text-muted-foreground text-lg">
            Находи людей с высокой астрологической совместимостью
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <Card
              key={user.id}
              className="glow border-primary/30 bg-card/80 backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xl font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{user.age} лет</span>
                        <span className="text-3xl">{user.sign}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCompatibilityColor(user.compatibility)} opacity-20 rounded-lg blur-xl`}></div>
                  <div className={`relative p-4 bg-gradient-to-r ${getCompatibilityColor(user.compatibility)} rounded-lg text-center`}>
                    <div className="text-sm font-medium mb-1">Совместимость</div>
                    <div className="text-4xl font-bold">{user.compatibility}%</div>
                    <Badge className="mt-2 bg-black/30 border-0">
                      {getCompatibilityLabel(user.compatibility)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {user.description}
                </p>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Icon name="Heart" size={18} className="mr-2" />
                    Нравится
                  </Button>
                  <Button variant="outline" className="flex-1 border-primary/30">
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Написать
                  </Button>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
                    <Icon name="Info" size={16} className="mr-2" />
                    Детали совместимости
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 glow">
            <Icon name="RefreshCw" size={20} className="mr-2" />
            Показать ещё профили
          </Button>
        </div>
      </div>
    </div>
  );
}
