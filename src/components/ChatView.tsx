import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  message_text: string;
  created_at: string;
  isOwn: boolean;
}

interface ChatViewProps {
  chat: {
    chat_id: number;
    other_user_id: number;
    other_user_name: string;
    other_user_sign: string;
  };
  currentUserId: number;
  onBack: () => void;
}

export default function ChatView({ chat, currentUserId, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      sender_id: currentUserId,
      sender_name: 'Вы',
      message_text: newMessage,
      created_at: new Date().toISOString(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const initials = chat.other_user_name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen w-full cosmic-gradient star-field flex flex-col">
      <div className="p-4 bg-card/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <Avatar className="w-12 h-12 border-2 border-primary">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{chat.other_user_name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">{chat.other_user_sign}</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Онлайн</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <Card className="glow border-muted/30 bg-card/80 backdrop-blur-sm text-center p-8">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Начните разговор! Напишите первое сообщение.
              </p>
            </Card>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/80 backdrop-blur-sm border border-border/50'
                }`}
              >
                {!message.isOwn && (
                  <div className="text-xs font-semibold mb-1 text-muted-foreground">
                    {message.sender_name}
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.message_text}</p>
                <div
                  className={`text-xs mt-2 ${
                    message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="pr-12 h-12 bg-input/50 resize-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => {}}
            >
              <Icon name="Smile" size={20} />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="flex-shrink-0 h-12 w-12 bg-primary hover:bg-primary/90"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
