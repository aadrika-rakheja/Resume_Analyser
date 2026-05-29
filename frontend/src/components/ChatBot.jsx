import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

export const ChatBot = ({ currentResumeId }) => {
  const { token, getAuthHeaders } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'bot',
      content: "Hello! I'm your AI Resume Coach. I'm ready to audit your resume details. Ask me anything about skills, ATS formatting, or custom project upgrades!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionTags = [
    "How do I boost my score?",
    "Give me strong action verbs",
    "How to make projects premium?",
    "ATS formatting tips"
  ];

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const promptText = textToSend || message;
    if (!promptText.trim() || loading) return;

    // Add user question to history
    setChatHistory(prev => [...prev, { role: 'user', content: promptText }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: promptText,
          resumeId: currentResumeId || null
        })
      });

      const resData = await response.json();
      
      if (resData.success) {
        setChatHistory(prev => [...prev, { role: 'bot', content: resData.reply }]);
      } else {
        throw new Error(resData.message || 'Chatbot failed to respond.');
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        role: 'bot', 
        content: `⚠️ Failed to fetch advice: ${err.message}. Please verify the server connection.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Toggled Coach Panel */}
      {isOpen && (
        <div className="chatbot-panel glass-panel">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} />
              <h3>AI Resume Coach</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Message Stream */}
          <div className="chatbot-messages">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`chat-bubble ${chat.role}`}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{chat.content}</div>
              </div>
            ))}
            
            {loading && (
              <div className="chat-bubble bot" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}></div>
                <span>Coach is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Templates suggestions */}
          <div className="chat-suggestions">
            {suggestionTags.map((tag, idx) => (
              <button 
                key={idx}
                className="chat-suggestion-tag"
                onClick={() => handleSendMessage(tag)}
                disabled={loading}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Text entry area */}
          <div className="chatbot-input-area">
            <input 
              type="text" 
              placeholder="Ask for resume optimization tips..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <button 
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating launcher action */}
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Career Assistant Coach"
      >
        <MessageSquare size={26} />
      </button>
    </div>
  );
};
export default ChatBot;
