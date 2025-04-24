import DashboardLayout from '@/layouts/DashboardLayout';
import ChatBot from '@/components/ChatBot';
import MainLayout from './layouts/MainLayout';

function AiAssistant() {
  return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-gray-500">Get help, insights, and information from your AI assistant</p>
        <ChatBot />
      </div>

  );
}
export default AiAssistant;