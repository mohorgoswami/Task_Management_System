import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Bot, Send, Loader2, FileText, MessageCircle, Lightbulb } from 'lucide-react';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';

function AIAssistant({ isOpen, onClose, projectId, projectName }) {
  const [activeTab, setActiveTab] = useState('summarize');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.summarize({ projectId });
      setSummary(response.data.summary);
      toast.success('Project summary generated');
    } catch (error) {
      toast.error('Failed to generate summary: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    
    const currentQuestion = question;
    setQuestion('');
    setLoading(true);

    try {
      const response = await aiAPI.askQuestion({ 
        projectId, 
        question: currentQuestion 
      });
      
      const aiMessage = { 
        type: 'ai', 
        content: response.data.answer, 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response: ' + error.message);
      const errorMessage = { 
        type: 'error', 
        content: 'Sorry, I could not process your question. Please try again.', 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab('summarize');
    setQuestion('');
    setConversation([]);
    setSummary('');
    onClose();
  };

  const tabs = [
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'chat', label: 'Q&A Chat', icon: MessageCircle },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="modal-content max-w-2xl max-h-[80vh]"
      overlayClassName="modal-overlay"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-600">{projectName}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'summarize' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Get an AI-powered summary of all tasks in this project
              </p>
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Summary...</span>
                  </div>
                ) : (
                  'Generate Summary'
                )}
              </button>
            </div>

            {summary && (
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Project Summary</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    {summary}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-96">
            {/* Conversation */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
              {conversation.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Ask me anything about your project tasks!</p>
                  <p className="text-sm mt-2">
                    Examples: "What tasks are overdue?", "What's the project progress?", "Which tasks need attention?"
                  </p>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : message.type === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleAskQuestion} className="flex space-x-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your project..."
                className="flex-1 input"
                disabled={loading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="btn-primary px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Suggestions</h3>
              <p className="text-gray-600 mb-6">
                Get intelligent suggestions to improve your project and task management
              </p>
              
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-blue-900 mb-2">📊 Project Analysis</h4>
                  <p className="text-sm text-blue-800">
                    Ask me to analyze your project progress and identify bottlenecks
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-green-900 mb-2">⚡ Task Optimization</h4>
                  <p className="text-sm text-green-800">
                    Get suggestions on task prioritization and deadline management
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-purple-900 mb-2">🎯 Productivity Tips</h4>
                  <p className="text-sm text-purple-800">
                    Receive personalized recommendations to boost team productivity
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Switch to the Q&A Chat tab to get personalized suggestions for your project
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AIAssistant;