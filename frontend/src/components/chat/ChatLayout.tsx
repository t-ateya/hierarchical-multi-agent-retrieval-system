
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/sidebar/ChatSidebar';
import { TokenBalance } from '@/components/profile/TokenBalance';
import { AlertCircle, Menu, Coins } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Message, Conversation } from '@/types/database.types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTokens } from '@/hooks/useTokens';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ChatLayoutProps {
  conversations: Conversation[];
  messages: Message[];
  selectedConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  isSidebarCollapsed: boolean;
  onSendMessage: (message: string) => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onToggleSidebar: () => void;
  newConversationId?: string | null;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  conversations,
  messages,
  selectedConversation,
  loading,
  error,
  isSidebarCollapsed,
  onSendMessage,
  onNewChat,
  onSelectConversation,
  onToggleSidebar,
  newConversationId
}) => {
  const isMobile = useIsMobile();
  const { balance } = useTokens();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  // Check if error is related to insufficient tokens
  const isTokenError = error && error.toLowerCase().includes('insufficient tokens');
  
  // Track when a response is being generated vs. just loading messages
  React.useEffect(() => {
    // Only set isGeneratingResponse to true when loading is true AND we have messages
    // This ensures we only show the loading indicator when generating a response, not when switching conversations
    if (loading && messages.length > 0) {
      setIsGeneratingResponse(true);
    } else {
      setIsGeneratingResponse(false);
    }
  }, [loading, messages.length]);
  
  // Wrapper for mobile conversation selection that also closes the sheet
  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation);
    if (isMobile) {
      setSheetOpen(false);
    }
  };
  
  // Wrapper for new chat that also closes the sheet on mobile
  const handleNewChat = () => {
    onNewChat();
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  // Custom onToggleSidebar for mobile that closes the sheet
  const handleToggleSidebar = () => {
    if (isMobile) {
      setSheetOpen(false);
    } else {
      onToggleSidebar();
    }
  };
  
  const renderSidebar = () => (
    <ChatSidebar
      conversations={conversations}
      isCollapsed={isMobile ? false : isSidebarCollapsed} // For desktop, use the collapse state
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      selectedConversationId={selectedConversation?.session_id || null}
      onToggleSidebar={handleToggleSidebar}
      newConversationId={newConversationId}
    />
  );

  const renderChatContent = () => (
    <div className="flex-1 flex flex-col overflow-hidden w-full relative">
      {/* Token balance for desktop */}
      {!isMobile && (
        <div className="absolute top-4 right-4 z-10">
          <Link to="/purchase">
            <Button variant="outline" size="sm">
              <Coins className="h-4 w-4 mr-1" />
              {balance} tokens
            </Button>
          </Link>
        </div>
      )}
      <main className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <Alert variant={isTokenError ? "default" : "destructive"} className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isTokenError ? "Tokens Required" : "Error"}</AlertTitle>
            <AlertDescription>
              {error}
              {isTokenError && (
                <Link to="/purchase" className="block mt-2">
                  <Button size="sm">Purchase Tokens</Button>
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden relative">
          <MessageList
            messages={messages}
            isLoading={loading}
            isGeneratingResponse={isGeneratingResponse}
          />
        </div>
        
        <div className="border-t">
          <div className="p-4 max-w-4xl mx-auto w-full">
            <ChatInput 
              onSendMessage={onSendMessage} 
              isLoading={loading}
            />
            <div className="mt-2 text-xs text-center text-muted-foreground">
              AI responses are generated based on your input. The AI agent may produce inaccurate information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // For mobile view
  if (isMobile) {
    return (
      <div className="flex h-screen bg-background flex-col overflow-hidden">
        <div className="flex items-center justify-between h-14 border-b px-4">
          <div className="flex items-center">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]" showCloseButton={false}>
                {renderSidebar()}
              </SheetContent>
            </Sheet>
            <div className="font-semibold">
              {selectedConversation?.title || "New Chat"}
            </div>
          </div>
          <Link to="/purchase">
            <Button variant="outline" size="sm">
              <Coins className="h-4 w-4 mr-1" />
              {balance}
            </Button>
          </Link>
        </div>
        {renderChatContent()}
      </div>
    );
  }

  // For desktop view
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {renderSidebar()}
      {renderChatContent()}
    </div>
  );
};
