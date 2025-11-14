import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import RegisterFlow from './RegisterFlow';

const AUTH_API_URL = 'https://functions.poehali.dev/32a0e3f4-4ca3-4d4f-b173-a3d3df04281d';

interface AuthProps {
  onAuthSuccess: (userData: { user_id: number; name: string; email: string; session_token: string }) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user_id', data.user_id.toString());
        onAuthSuccess(data);
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister) {
    return (
      <RegisterFlow 
        onComplete={onAuthSuccess} 
        onBack={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent mb-4 animate-float">
            Stellar Match
          </h1>
          <p className="text-muted-foreground text-lg">
            Астрологическое приложение для знакомств
          </p>
        </div>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Добро пожаловать</CardTitle>
            <CardDescription className="text-center">
              Войдите в свой аккаунт
            </CardDescription>
          </CardHeader>
          <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-input/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-input/50"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      <>
                        <Icon name="LogIn" size={20} className="mr-2" />
                        Войти
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Нет аккаунта?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-primary/30"
                    onClick={() => setShowRegister(true)}
                  >
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    Создать аккаунт
                  </Button>
                </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}