import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, ArrowLeft, RotateCcw, Send } from 'lucide-react';
import './Chatbot.css'; // We'll create this CSS file next

interface Question {
  id: string;
  text: string;
  parentId?: string;
  children?: Question[];
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  questionId?: string;
}

interface ChatbotProps {
  questions: Question[];
  findQuestionById: (id: string) => Question | null;
}

const TypingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const animationTimer = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 600);
      return () => clearInterval(animationTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`typing-dot ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
};

const Chatbot: React.FC<ChatbotProps> = ({ 
  questions = [], 
  findQuestionById = () => null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionLevel, setCurrentQuestionLevel] = useState<Question[]>([]);
  const [questionHistory, setQuestionHistory] = useState<Question[][]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize with root questions when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const rootQuestions = questions.filter(q => !q.parentId);
      setCurrentQuestionLevel(rootQuestions);
      
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          text: "Hello! 👋 Welcome to HealthCare Assistant. I'm here to help you with medical consultations, medicine orders, and health services. How can I assist you today?",
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [isOpen, questions, messages.length]);

  const getQuestionChildren = (questionId: string): Question[] => {
    try {
      const question = findQuestionById(questionId);
      return question?.children || [];
    } catch (error) {
      console.error('Error finding question:', error);
      return [];
    }
  };

  const simulateTyping = (callback: () => void, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleQuestionClick = (question: Question) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: question.text,
      isBot: false,
      timestamp: new Date(),
      questionId: question.id
    };

    setMessages(prev => [...prev, userMessage]);

    simulateTyping(() => {
      const children = getQuestionChildren(question.id);
      
      if (children.length > 0) {
        setQuestionHistory(prev => [...prev, currentQuestionLevel]);
        setCurrentQuestionLevel(children);
        
        const responses = [
          "Great choice! Let me show you the available options:",
          "Perfect! Here are your next steps:",
          "Excellent! Please select from the following:",
          "I understand. Here are the options for you:",
          "Thank you for that information. Please choose:"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          text: randomResponse,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const endResponses = [
          "Thank you for your selection! Our healthcare team will assist you with this request shortly. You'll receive a confirmation message within 5 minutes. Is there anything else I can help you with? 😊",
          "Perfect! I've noted your request. A healthcare professional will contact you soon to proceed with your request. Can I help you with anything else today?",
          "Excellent! Your request has been submitted successfully. You'll receive further instructions via SMS/Email. Is there any other way I can assist you?",
          "Great! I've forwarded your request to the appropriate department. They'll get back to you within 30 minutes. Anything else you need help with?"
        ];
        
        const randomEndResponse = endResponses[Math.floor(Math.random() * endResponses.length)];
        
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          text: randomEndResponse,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        
        setTimeout(() => {
          const rootQuestions = questions.filter(q => !q.parentId);
          setCurrentQuestionLevel(rootQuestions);
          setQuestionHistory([]);
        }, 3000);
      }
    }, Math.random() * 1000 + 800);
  };

  const goBack = () => {
    if (questionHistory.length > 0) {
      const previousLevel = questionHistory[questionHistory.length - 1];
      setCurrentQuestionLevel(previousLevel);
      setQuestionHistory(prev => prev.slice(0, -1));
      
      const backMessage: ChatMessage = {
        id: `msg-${Date.now()}-back`,
        text: "Let me take you back to the previous options:",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, backMessage]);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentQuestionLevel([]);
    setQuestionHistory([]);
    setIsTyping(false);
    
    setTimeout(() => {
      const rootQuestions = questions.filter(q => !q.parentId);
      setCurrentQuestionLevel(rootQuestions);
      
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        text: "Hello! 👋 Welcome back to HealthCare Assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      setFade(1);
    } else {
      setFade(0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="floating-button"
      >
        <MessageCircle size={24} color="white" />
        <span className="notification-dot"></span>
      </button>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="header-icon-container">
            <MessageCircle size={20} color="white" />
            <span className="header-notification-dot"></span>
          </div>
          <div>
            <h3 className="header-title">HealthCare Assistant</h3>
            <p className="header-subtitle">Online • Ready to help</p>
          </div>
        </div>
        <div className="header-actions">
          {questionHistory.length > 0 && (
            <button
              onClick={goBack}
              className="header-button"
            >
              <ArrowLeft size={16} color="white" />
            </button>
          )}
          <button
            onClick={resetChat}
            className="header-button"
          >
            <RotateCcw size={16} color="white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="header-button"
          >
            <span className="close-button">×</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${
              message.isBot ? 'bot-message-wrapper' : 'user-message-wrapper'
            }`}
          >
            <div className={`message-container ${
              message.isBot ? 'bot-message-container' : 'user-message-container'
            }`}>
              {message.isBot && (
                <div className="bot-avatar">
                  <span className="bot-avatar-text">AI</span>
                </div>
              )}
              <div className={`message-bubble ${
                message.isBot ? 'bot-message-bubble' : 'user-message-bubble'
              }`}>
                <p className={`message-text ${
                  message.isBot ? 'bot-message-text' : 'user-message-text'
                }`}>
                  {message.text}
                </p>
                <span className={`message-time ${
                  message.isBot ? 'bot-message-time' : 'user-message-time'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message-wrapper bot-message-wrapper">
            <div className="message-container bot-message-container">
              <div className="bot-avatar">
                <span className="bot-avatar-text">AI</span>
              </div>
              <div className="message-bubble bot-message-bubble">
                <div className="typing-indicator">
                  <TypingDot delay={0} />
                  <TypingDot delay={100} />
                  <TypingDot delay={200} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Question Options as Chat Bubbles */}
        {currentQuestionLevel.length > 0 && !isTyping && (
          <div className="message-wrapper bot-message-wrapper">
            <div className="message-container bot-message-container">
              <div className="bot-avatar">
                <span className="bot-avatar-text">AI</span>
              </div>
              <div className="message-bubble bot-message-bubble">
                <p className="options-prompt">Please choose an option:</p>
                <div className="options-container">
                  {currentQuestionLevel.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question)}
                      className="option-button"
                      style={{ opacity: fade }}
                    >
                      <div className="option-button-content">
                        <span className="option-button-text">{question.text}</span>
                        <Send size={14} color="#1e40af" className="option-button-icon" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chatbot;