'use client'

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from '@/components/ui/chat/expandable-chat'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeDisplayBlock from '../components/code-display-block'

export default function ChatSupport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('multion_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    setIsGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          query: input,
          url: 'https://www.google.com',
          optional_params: {
            source: "playground"
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred while processing your request. Please try again.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || !input.trim()) return;
      formRef.current?.requestSubmit();
    }
  };

  return (
    <ExpandableChat
      size='md'
      position='bottom-right'>
      <ExpandableChatHeader className='bg-muted/60 flex-col text-center justify-center'>
        <h1 className='text-xl font-semibold'>Chat with our AI ✨</h1>
        <p>Ask any question for our AI to answer</p>
        <div className='flex gap-2 items-center pt-2'>
          <Button
            variant='secondary'
            onClick={() => setMessages([])}
          >
            New Chat
          </Button>
          <Button
            variant='secondary'
          >
            See FAQ
          </Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList className='bg-muted/25' ref={messagesRef}>
          {/* Initial message */}
          <ChatBubble variant='received'>
            <ChatBubbleAvatar src='' fallback='🤖' />
            <ChatBubbleMessage>
              Hello! I&apos;m the AI assistant. How can I help you today?
            </ChatBubbleMessage>
          </ChatBubble>

          {/* Messages */}
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar
                src='' fallback={message.role === 'user' ? '👨🏽' : '🤖'}
              />
              <ChatBubbleMessage
                variant={message.role === 'user' ? 'sent' : 'received'}>
                {message.content
                  .split("```")
                  .map((part: string, index: number) => {
                    if (index % 2 === 0) {
                      return (
                        <Markdown key={index} remarkPlugins={[remarkGfm]}>
                          {part}
                        </Markdown>
                      );
                    } else {
                      return (
                        <pre
                          className="pt-2"
                          key={index}
                        >
                          <CodeDisplayBlock code={part} lang="" />
                        </pre>
                      );
                    }
                  })}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {/* Loading */}
          {isGenerating && (
            <ChatBubble variant='received'>
              <ChatBubbleAvatar
                src='' fallback='🤖'
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className='bg-muted/25'>
        <form
          ref={formRef}
          className='flex relative gap-2'
          onSubmit={onSubmit}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            className="min-h-12 bg-background shadow-none"
          />
          <Button
            className='absolute top-1/2 right-2 transform -translate-y-1/2'
            type="submit"
            size="icon"
            disabled={isGenerating || !input.trim() || !userId}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}

