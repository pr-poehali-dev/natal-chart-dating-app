import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CompatibilityDetailProps {
  user: {
    name: string;
    age: number;
    sign: string;
    zodiac_sign: string;
    initials: string;
    compatibility: number;
  };
  onClose: () => void;
}

export default function CompatibilityDetail({ user, onClose }: CompatibilityDetailProps) {
  const aspects = [
    {
      name: 'Эмоциональная связь',
      score: user.compatibility >= 90 ? 95 : user.compatibility >= 80 ? 88 : 75,
      description: 'Глубокое понимание эмоций партнёра',
      icon: 'Heart'
    },
    {
      name: 'Интеллектуальная совместимость',
      score: user.compatibility >= 90 ? 92 : user.compatibility >= 80 ? 85 : 78,
      description: 'Общие интересы и темы для обсуждения',
      icon: 'Brain'
    },
    {
      name: 'Ценности и цели',
      score: user.compatibility >= 90 ? 90 : user.compatibility >= 80 ? 82 : 73,
      description: 'Схожее видение будущего',
      icon: 'Target'
    },
    {
      name: 'Коммуникация',
      score: user.compatibility >= 90 ? 94 : user.compatibility >= 80 ? 89 : 80,
      description: 'Лёгкость в общении и взаимопонимание',
      icon: 'MessageSquare'
    }
  ];

  const strengths = [
    'Сильная эмоциональная связь и эмпатия',
    'Схожие жизненные ценности и приоритеты',
    'Взаимное уважение и поддержка',
    'Гармоничное энергетическое сочетание знаков'
  ];

  const challenges = [
    'Возможны разногласия в методах достижения целей',
    'Необходимо учитывать различия в темпераменте',
    'Важно находить время для совместных интересов'
  ];

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-accent">
            Детали совместимости
          </h1>
        </div>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <span>{user.age} лет</span>
                  <span className="text-2xl">{user.sign}</span>
                  <span>{user.zodiac_sign}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30 text-center">
              <div className="text-sm font-medium mb-2 text-muted-foreground">Общая совместимость</div>
              <div className="text-6xl font-bold mb-2 text-primary animate-pulse">
                {user.compatibility}%
              </div>
              <div className="text-lg text-muted-foreground">
                {user.compatibility >= 90 ? 'Идеальное сочетание' :
                 user.compatibility >= 80 ? 'Отличная совместимость' :
                 user.compatibility >= 70 ? 'Хорошие перспективы' : 'Средний уровень'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="TrendingUp" size={24} className="text-primary" />
              Аспекты совместимости
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aspects.map((aspect, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name={aspect.icon as any} size={20} className="text-primary" />
                    <span className="font-semibold">{aspect.name}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{aspect.score}%</span>
                </div>
                <Progress value={aspect.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{aspect.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glow border-green-500/30 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-green-400">
                <Icon name="CheckCircle" size={20} />
                Сильные стороны
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="Plus" size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glow border-yellow-500/30 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-yellow-400">
                <Icon name="AlertTriangle" size={20} />
                Области роста
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="glow border-accent/30 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Sparkles" size={24} className="text-accent" />
              Астрологическое заключение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ваши натальные карты демонстрируют {user.compatibility >= 85 ? 'исключительно гармоничное' : 'благоприятное'} 
              сочетание планетарных позиций. Солнце и Луна образуют {user.compatibility >= 90 ? 'трин' : 'секстиль'}, 
              что указывает на естественное взаимопонимание и эмоциональную поддержку.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Венера и Марс находятся в комплементарных знаках, создавая баланс между романтикой и страстью. 
              Это сочетание обещает {user.compatibility >= 85 ? 'глубокую и длительную' : 'стабильную'} связь 
              с потенциалом для совместного роста и развития.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-lg">
            <Icon name="Heart" size={20} className="mr-2" />
            Нравится
          </Button>
          <Button variant="outline" className="flex-1 h-14 border-primary/30 text-lg">
            <Icon name="MessageCircle" size={20} className="mr-2" />
            Написать
          </Button>
        </div>
      </div>
    </div>
  );
}
