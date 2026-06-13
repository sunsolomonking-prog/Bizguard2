import React from 'react';
import {
  Send,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  User,
} from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../utils/cn';
import { formatCurrency } from '../utils/helpers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const suggestedQuestions = [
  "What are my top-selling products this week?",
  "Which customers have overdue payments?",
  "Show me inventory items that need restocking",
  "What's my sales trend compared to last month?",
  "Generate a summary of today's sales",
  "What actions should I prioritize today?",
];

const quickActions = [
  { icon: TrendingUp, label: 'Sales Report', color: 'from-emerald-500 to-green-600' },
  { icon: AlertTriangle, label: 'Risk Analysis', color: 'from-red-500 to-orange-600' },
  { icon: Lightbulb, label: 'Insights', color: 'from-yellow-500 to-amber-600' },
  { icon: MessageSquare, label: 'Customer Feedback', color: 'from-blue-500 to-cyan-600' },
];

export const AIAssistant: React.FC = () => {
  const { aiMessages, addAiMessage } = useAppStore();
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('top-selling') || lowerMessage.includes('top selling')) {
      return `Based on your sales data this week, here are your top-selling products:\n\n1. **Wireless Mouse** - 45 units sold (₦202,500)\n2. **Mechanical Keyboard** - 23 units sold (₦345,000)\n3. **USB-C Cable** - 67 units sold (₦80,400)\n4. **Monitor 24"** - 12 units sold (₦540,000)\n5. **Laptop Stand** - 18 units sold (₦117,000)\n\nTotal revenue from top products: **₦1,284,900**\n\nWould you like me to generate a detailed report or suggest restock quantities?`;
    }
    
    if (lowerMessage.includes('overdue') || lowerMessage.includes('payment')) {
      return `You currently have **3 customers with overdue payments**:\n\n1. **Mike Johnson** - ₦95,000 (15 days overdue)\n2. **John Doe** - ₦45,000 (5 days overdue)\n3. **Sarah Wilson** - ₦25,000 (2 days overdue)\n\n**Total overdue: ₦165,000**\n\nRecommended actions:\n- Send payment reminders to Mike Johnson (high priority)\n- Follow up with John Doe via phone\n- Send automated email to Sarah Wilson\n\nWould you like me to draft reminder messages?`;
    }
    
    if (lowerMessage.includes('restock') || lowerMessage.includes('inventory')) {
      return `Based on current stock levels and sales velocity, here are items that need restocking:\n\n**Urgent **(Out of Stock)\n- Laptop Stand (LS-003) - Order 10 units\n\n**Low Stock **(Below reorder level)\n- USB-C Cable (UC-002) - 8 remaining, reorder 20 units\n- Webcam HD (WC-006) - 6 remaining, reorder 15 units\n\n**Estimated restock cost: ₦142,000**\n\nWould you like me to create purchase orders for these items?`;
    }
    
    if (lowerMessage.includes('sales trend') || lowerMessage.includes('trend')) {
      return `Your sales trend analysis:\n\n**This Week vs Last Week**:\n- Total Sales: ₦825,000 (+23.5% 📈)\n- Average Order: ₦58,928 (+12.3%)\n- Transactions: 14 (+3)\n\n**Peak Hours**: 2PM - 6PM\n**Best Day**: Saturday (₦189,000)\n\n**Insights**:\n- Sales are trending upward consistently\n- Weekend sales are 40% higher than weekdays\n- Electronics category driving 60% of revenue\n\nWould you like a detailed breakdown by category?`;
    }
    
    if (lowerMessage.includes('summary') || lowerMessage.includes('today')) {
      return `**Today's Sales Summary** (January 15, 2024)\n\n📊 **Overview**:\n- Total Sales: ₦125,000\n- Transactions: 8\n- Average Order: ₦15,625\n- New Customers: 2\n\n💰 **Payment Methods**:\n- Cash: ₦67,000 (54%)\n- Card: ₦38,000 (30%)\n- Mobile: ₦20,000 (16%)\n\n🏆 **Top Product**: Wireless Mouse (5 units)\n\n⚠️ **Alerts**: 2 low stock items detected\n\nGreat day overall! Sales are 15% above daily average.`;
    }
    
    if (lowerMessage.includes('prioritize') || lowerMessage.includes('actions') || lowerMessage.includes('action')) {
      return `**Today's Priority Actions**:\n\n🔴 **Urgent **(Do Now)\n1. Follow up with Mike Johnson on ₦95,000 overdue payment\n2. Restock Laptop Stands (currently out of stock)\n\n🟡 **Important **(Today)\n3. Review and approve 3 pending purchase orders\n4. Send payment reminders to 5 customers\n5. Check inventory for USB-C Cables\n\n🟢 **Routine **(This Week)\n6. Generate weekly sales report\n7. Update product prices for Electronics category\n8. Review customer feedback from last week\n\n**Estimated time to complete urgent tasks: 45 minutes**\n\nWould you like me to help you with any of these tasks?`;
    }
    
    return `I understand you're asking about "${userMessage}". \n\nAs your AI business assistant, I can help you with:\n\n📊 **Sales Analysis** - Trends, reports, and insights\n📦 **Inventory Management** - Stock levels, restocking, predictions\n💰 **Financial Tracking** - Revenue, expenses, cash flow\n👥 **Customer Management** - Debtors, payments, relationships\n⚠️ **Risk Assessment** - Business health and alerts\n📈 **Predictions** - Demand forecasting and opportunities\n\nTry asking me something like:\n- "What are my top-selling products?"\n- "Which customers owe money?"\n- "Show me inventory that needs restocking"\n- "Generate a sales summary"\n\nHow can I help you today?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    addAiMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
        timestamp: new Date().toISOString(),
        suggestions: ['Tell me more', 'Generate report', 'Take action'],
      };
      addAiMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
              <p className="text-slate-500 mt-1">Your intelligent business companion</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main chat area */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {aiMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Hello! I'm BizGuard AI</h2>
                <p className="text-slate-500 mt-2 max-w-md">
                  I'm here to help you manage your business smarter. Ask me anything about your sales, inventory, customers, or get actionable insights.
                </p>
                
                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                        action.color
                      )}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Suggested questions */}
                <div className="mt-8 w-full max-w-2xl">
                  <p className="text-sm text-slate-500 mb-3">Or try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(question)}
                        className="px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg text-sm transition-colors border border-slate-200 hover:border-emerald-300"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {aiMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-4',
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={cn(
                      'flex-1 max-w-2xl',
                      message.role === 'user' ? 'text-right' : ''
                    )}>
                      <div className={cn(
                        'inline-block p-4 rounded-2xl',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.suggestions && message.role === 'assistant' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your business..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-4">
          {/* Business health */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Business Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Overall Score</span>
                  <span className="font-semibold text-emerald-600">78/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Sales</p>
                  <p className="text-lg font-semibold text-emerald-600">+23%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Inventory</p>
                  <p className="text-lg font-semibold text-yellow-600">-5%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Today's Sales</span>
                <span className="font-semibold text-slate-800">{formatCurrency(125000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending Orders</span>
                <span className="font-semibold text-slate-800">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Low Stock Items</span>
                <span className="font-semibold text-red-600">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Overdue Payments</span>
                <span className="font-semibold text-red-600">{formatCurrency(165000)}</span>
              </div>
            </div>
          </div>

          {/* Recent insights */}
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-semibold">AI Insight</h3>
            </div>
            <p className="text-sm opacity-90">
              Your electronics category is performing 40% better than last month. Consider increasing stock levels for high-demand items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
