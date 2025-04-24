
import ChatBot from '@/components/chatbot/ChatBot';


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