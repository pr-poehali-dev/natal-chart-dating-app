import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BirthData {
  date: string;
  time: string;
  city: string;
}

export default function Profile() {
  const [birthData, setBirthData] = useState<BirthData>({
    date: '',
    time: '',
    city: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthData.date && birthData.time && birthData.city) {
      setIsComplete(true);
    }
  };

  const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent animate-float">
            Твой Профиль
          </h1>
          <p className="text-muted-foreground text-lg">
            Данные рождения создают твою уникальную натальную карту
          </p>
        </div>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Icon name="UserCircle" size={32} className="text-primary" />
              Данные рождения
            </CardTitle>
            <CardDescription className="text-base">
              Эти данные конфиденциальны и используются только для расчета совместимости
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-lg">
                  Дата рождения
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={birthData.date}
                  onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                  className="text-lg h-12 bg-input/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-lg">
                  Время рождения
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={birthData.time}
                  onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                  className="text-lg h-12 bg-input/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg">
                  Город рождения
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Москва"
                  value={birthData.city}
                  onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                  className="text-lg h-12 bg-input/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 glow"
              >
                <Icon name="Sparkles" size={20} className="mr-2" />
                Создать натальную карту
              </Button>
            </form>
          </CardContent>
        </Card>

        {isComplete && (
          <Card className="glow border-accent/30 bg-card/80 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="Stars" size={32} className="text-accent" />
                Твоя натальная карта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-6 gap-4 p-6 bg-muted/30 rounded-xl">
                {zodiacSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="text-4xl text-center hover:scale-125 transition-transform cursor-pointer"
                    style={{
                      opacity: 0.3 + (index % 3) * 0.3,
                      color: `hsl(${(index * 30) + 240}, 70%, 70%)`
                    }}
                  >
                    {sign}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Солнце</div>
                  <div className="text-2xl font-semibold text-primary">♌ Лев</div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="text-sm text-muted-foreground mb-1">Луна</div>
                  <div className="text-2xl font-semibold text-secondary">♋ Рак</div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="text-sm text-muted-foreground mb-1">Асцендент</div>
                  <div className="text-2xl font-semibold text-accent">♏ Скорпион</div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Info" size={20} />
                  Ключевые характеристики
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Твоя натальная карта показывает сильную творческую энергию и глубокую эмоциональность. 
                  Сочетание знаков указывает на харизматичную личность с сильной интуицией.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
