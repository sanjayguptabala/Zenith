import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatbotResponseStream, resetChat } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

const UserIcon = () => (
    <svg xmlns="http://www.ww3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const BotIcon = () => (
     <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"/>
    </svg>
);

const BlinkingCursorStyle = () => (
    <style>
    {`
        @keyframes blink {
            50% { opacity: 0; }
        }
        .blinking-cursor {
            animation: blink 1s step-end infinite;
            font-weight: bold;
            display: inline-block;
            margin-left: 2px;
            color: #4A90E2;
        }
    `}
    </style>
);


const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm Zenith, your supportive AI assistant. How are you feeling today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (textToSend.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = Date.now() + 1;
        const placeholderMessage: ChatMessage = {
            id: botMessageId,
            text: '', // Start with empty text for streaming
            sender: 'bot',
        };
        setMessages(prev => [...prev, placeholderMessage]);

        try {
            const stream = getChatbotResponseStream(textToSend, messages);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev => prev.map(m => 
                    m.id === botMessageId ? { ...m, text: fullResponse } : m
                ));
            }
        } catch (error) {
            console.error(error);
             const errorMessage: ChatMessage = {
                id: botMessageId,
                text: "Sorry, I'm having some trouble connecting. Please try again later.",
                sender: 'bot',
            };
            setMessages(prev => prev.map(m => m.id === botMessageId ? errorMessage : m));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClearChat = () => {
        setMessages([
            { id: 1, text: "Hello! I'm Zenith, your supportive AI assistant. How can I help you today?", sender: 'bot' }
        ]);
        resetChat();
    };

    const quickActions = [
        "I'm feeling stressed", 
        "I have trouble sleeping", 
        "I'm worried about exams",
        "I'm feeling lonely",
        "How can I stop procrastinating?",
        "Can I get some study tips?",
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <BlinkingCursorStyle />
            <header className="flex justify-between items-start mb-8 text-left">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">AI Support Chatbot</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Talk with Zenith, your supportive AI, for guidance and resources.</p>
                </div>
                <button
                    onClick={handleClearChat}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                    Clear Chat
                </button>
            </header>
            <div className="flex flex-col h-[calc(100vh-20rem)] max-w-3xl mx-auto bg-card dark:bg-gray-800 shadow-2xl rounded-2xl transition-colors duration-300">
                <div className="flex-1 p-6 overflow-y-auto">
                    {messages.map((msg, index) => {
                        const isLastMessage = index === messages.length - 1;
                        const isStreaming = isLoading && isLastMessage && msg.sender === 'bot';

                        return (
                            <div key={msg.id} className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <div className="bg-primary rounded-full p-1 self-start shrink-0"><BotIcon /></div>}
                                <div className={`p-4 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    <MarkdownRenderer content={msg.text} />
                                    {isStreaming && msg.text.length === 0 && <div className="flex items-center space-x-1"><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span></div>}
                                    {isStreaming && msg.text.length > 0 && <span className="blinking-cursor">|</span>}
                                </div>
                                {msg.sender === 'user' && <div className="bg-gray-400 rounded-full p-1 self-start shrink-0"><UserIcon /></div>}
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {quickActions.map(action => (
                            <button key={action} onClick={() => handleSend(action)} disabled={isLoading} className="px-3 py-1 text-sm bg-primary/10 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 rounded-full hover:bg-primary/20 disabled:opacity-50">
                                {action}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button onClick={() => handleSend()} disabled={isLoading || input.trim() === ''} className="p-3 bg-primary text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;