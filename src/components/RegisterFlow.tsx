import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const AUTH_API_URL = 'https://functions.poehali.dev/32a0e3f4-4ca3-4d4f-b173-a3d3df04281d';
const NATAL_API_URL = 'https://functions.poehali.dev/d6cae79a-9e1d-4137-9dca-e23bf189eaf3';

interface RegisterFlowProps {
  onComplete: (userData: { user_id: number; name: string; email: string; session_token: string }) => void;
  onBack: () => void;
}

export default function RegisterFlow({ onComplete, onBack }: RegisterFlowProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [birthData, setBirthData] = useState({
    birth_date: '',
    birth_time: '',
    birth_city: ''
  });

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountData.password !== accountData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (accountData.password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setStep(2);
  };

  const handleStep2Complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authResponse = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: accountData.name,
          email: accountData.email,
          password: accountData.password
        })
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        setError(authData.error || 'Ошибка регистрации');
        setIsLoading(false);
        return;
      }

      const natalResponse = await fetch(NATAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_birth_data',
          user_id: authData.user_id,
          birth_date: birthData.birth_date,
          birth_time: birthData.birth_time,
          birth_city: birthData.birth_city
        })
      });

      if (!natalResponse.ok) {
        console.error('Failed to save birth data');
      }

      localStorage.setItem('session_token', authData.session_token);
      localStorage.setItem('user_id', authData.user_id.toString());
      
      onComplete(authData);
    } catch (err) {
      setError('Ошибка подключения к серверу');
      setIsLoading(false);
    }
  };

  const progressPercent = (step / 2) * 100;

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent mb-4 animate-float">
            Регистрация
          </h1>
          <p className="text-muted-foreground text-lg">
            Шаг {step} из 2
          </p>
        </div>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <Progress value={progressPercent} className="mb-4" />
            <CardTitle className="text-center text-2xl">
              {step === 1 ? 'Создание аккаунта' : 'Данные рождения'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? 'Введите ваши данные для входа' 
                : 'Для создания натальной карты'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ваше имя"
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={accountData.password}
                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Подтвердите пароль</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onBack}
                  >
                    Назад
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    Далее
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Complete} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Дата рождения</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={birthData.birth_date}
                    onChange={(e) => setBirthData({ ...birthData, birth_date: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_time">Время рождения</Label>
                  <Input
                    id="birth_time"
                    type="time"
                    value={birthData.birth_time}
                    onChange={(e) => setBirthData({ ...birthData, birth_time: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_city">Город рождения</Label>
                  <Input
                    id="birth_city"
                    type="text"
                    placeholder="Москва"
                    value={birthData.birth_city}
                    onChange={(e) => setBirthData({ ...birthData, birth_city: e.target.value })}
                    className="bg-input/50"
                    required
                  />
                </div>

                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Icon name="Lock" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p>
                      Эти данные конфиденциальны и используются только для расчёта совместимости
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    Назад
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" size={18} className="mr-2" />
                        Завершить
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}