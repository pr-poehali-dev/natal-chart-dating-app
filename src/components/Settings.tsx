import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

export default function Settings() {
  return (
    <div className="min-h-screen w-full cosmic-gradient star-field p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-accent animate-float">
            Настройки
          </h1>
          <p className="text-muted-foreground text-lg">
            Персонализируй своё приложение
          </p>
        </div>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Bell" size={24} className="text-primary" />
              Уведомления
            </CardTitle>
            <CardDescription>Управляй получением уведомлений</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="matches" className="text-base">Новые совпадения</Label>
                <p className="text-sm text-muted-foreground">Уведомления о взаимных симпатиях</p>
              </div>
              <Switch id="matches" defaultChecked />
            </div>

            <Separator className="bg-border/50" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="messages" className="text-base">Сообщения</Label>
                <p className="text-sm text-muted-foreground">Новые сообщения в чатах</p>
              </div>
              <Switch id="messages" defaultChecked />
            </div>

            <Separator className="bg-border/50" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="compatibility" className="text-base">Высокая совместимость</Label>
                <p className="text-sm text-muted-foreground">Когда находится человек с совместимостью выше 90%</p>
              </div>
              <Switch id="compatibility" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-primary" />
              Приватность
            </CardTitle>
            <CardDescription>Контролируй видимость своего профиля</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="visible" className="text-base">Видимость профиля</Label>
                <p className="text-sm text-muted-foreground">Показывать профиль в поиске</p>
              </div>
              <Switch id="visible" defaultChecked />
            </div>

            <Separator className="bg-border/50" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="online" className="text-base">Статус онлайн</Label>
                <p className="text-sm text-muted-foreground">Показывать когда ты онлайн</p>
              </div>
              <Switch id="online" />
            </div>
          </CardContent>
        </Card>

        <Card className="glow border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Sliders" size={24} className="text-primary" />
              Параметры поиска
            </CardTitle>
            <CardDescription>Настрой критерии подбора</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base">Минимальная совместимость</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue="70"
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold text-primary min-w-[50px]">70%</span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-2">
              <Label className="text-base">Возрастной диапазон</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">18</span>
                <input
                  type="range"
                  min="18"
                  max="60"
                  defaultValue="35"
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold text-primary min-w-[50px]">35 лет</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glow border-destructive/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
              <Icon name="LogOut" size={24} />
              Аккаунт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-primary/30">
              <Icon name="Key" size={18} className="mr-2" />
              Изменить пароль
            </Button>
            <Button variant="destructive" className="w-full">
              <Icon name="Trash2" size={18} className="mr-2" />
              Удалить аккаунт
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
