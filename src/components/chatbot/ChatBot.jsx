import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/geminiService';
import './ChatBot.css';

const SUGGESTED_QUESTIONS = [
  'How long should I spend here?',
  'What\'s the best time to visit?',
  'What food should I try?',
  'What are the hidden gems?',
  'How do I get around?',
  'What\'s the local budget like?',
];

export default function ChatBot({ destination = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: destination
          ? `Hey there! ✈️ I'm your AI travel guide for **${destination.name}**. Ask me anything — best time to visit, what to see, local tips, hidden gems or I can plan your whole trip!`
          : `Hey there! ✈️ I'm your AI travel assistant. Ask me anything about destinations around the world, trip planning, travel tips, or local culture. Where are you dreaming of going?`,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, destination]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput('');
    setError(null);

    const userMsg = { id: Date.now(), role: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const history = messages.filter(m => m.id !== 'welcome').map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await sendChatMessage(history, userMessage, destination);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chatbot-fab ${isOpen ? 'chatbot-fab-open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI travel assistant'}
        aria-expanded={isOpen}
        id="chatbot-toggle"
      >
        <span className="chatbot-fab-icon" aria-hidden="true">
          {isOpen ? '✕' : '🤖'}
        </span>
        {!isOpen && (
          <span className="chatbot-fab-label">AI Guide</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chatbot-window glass-card animate-scale-in"
          role="dialog"
          aria-label="AI Travel Assistant"
          aria-modal="true"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar" aria-hidden="true">🤖</div>
              <div>
                <h2 className="chatbot-title">AI Travel Guide</h2>
                {destination && (
                  <p className="chatbot-subtitle">{destination.name} Expert</p>
                )}
              </div>
            </div>
            <div className="chatbot-status" aria-label="AI assistant status: online">
              <span className="chatbot-status-dot" aria-hidden="true" />
              <span>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chatbot-message ${msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-ai'}`}
                aria-label={`${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`}
              >
                {msg.role === 'assistant' && (
                  <span className="chatbot-msg-avatar" aria-hidden="true">🤖</span>
                )}
                <div
                  className="chatbot-message-bubble"
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="chatbot-message chatbot-message-ai" aria-live="polite">
                <span className="chatbot-msg-avatar" aria-hidden="true">🤖</span>
                <div className="chatbot-message-bubble chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <div className="chatbot-error" role="alert">
                ⚠️ {error}
                <button className="chatbot-retry" onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (show when few messages) */}
          {messages.length <= 2 && (
            <div className="chatbot-suggestions" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map(q => (
                <button
                  key={q}
                  className="chatbot-suggestion-chip"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your trip..."
                className="chatbot-input"
                aria-label="Message to AI assistant"
                rows={1}
                disabled={loading}
              />
              <button
                className="chatbot-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                id="chatbot-send"
              >
                ➤
              </button>
            </div>
            <p className="chatbot-hint">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
}
