import React, { useRef, useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { UseAuthStore } from '../store/UseAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from '../lib/utils';
import { Trash2, Check, CheckCheck } from 'lucide-react';

const ChatContainer = ({ onProfileClick }) => {
  const { authUser } = UseAuthStore();
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    deleteMessage,
    isDeletingMessage,
    unsubscribeFromMessages,
    subscribeToMessages,
  } = useChatStore();
  const [showDeleteFor, setShowDeleteFor] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageClick = (messageId, isOwn) => {
    if (isOwn) {
      setShowDeleteFor(showDeleteFor === messageId ? null : messageId);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setShowDeleteFor(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  // ✅ Deduplicate messages based on _id
  const uniqueMessagesMap = new Map();
  messages.forEach((msg) => {
    if (!uniqueMessagesMap.has(msg._id)) {
      uniqueMessagesMap.set(msg._id, msg);
    }
  });
  const uniqueMessages = Array.from(uniqueMessagesMap.values());

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader onProfileClick={onProfileClick} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-base-100/50 to-base-200/30 transition-colors duration-300 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--p),0.1),transparent_50%)]"></div>
      </div>

      <ChatHeader onProfileClick={onProfileClick} />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-base-200/20 relative"
        style={{
          scrollbarColor: 'hsl(var(--p) / 0.3) hsl(var(--b2) / 0.2)',
          scrollbarWidth: 'thin',
        }}
      >
        {uniqueMessages.map((message, idx) => {
          const isOwn = message.senderId === authUser._id;
          const showAvatar = idx === 0 || uniqueMessages[idx - 1]?.senderId !== message.senderId;
          const isConsecutive = idx > 0 && uniqueMessages[idx - 1]?.senderId === message.senderId;

          return (
            <div
              key={message._id}
              className={`group flex items-end gap-3 ${isOwn ? 'justify-end' : 'justify-start'} ${
                isConsecutive ? 'mt-1' : 'mt-4'
              }`}
            >
              {!isOwn && showAvatar && (
                <div
                  className="avatar shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => onProfileClick && onProfileClick(selectedUser)}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/20 ring-offset-1 ring-offset-base-100 shadow-md">
                    <img
                      src={selectedUser.profilePic || '/avatar.png'}
                      alt="profile"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {!isOwn && !showAvatar && <div className="w-8 sm:w-10 shrink-0"></div>}

              <div
                className={`relative max-w-[75vw] sm:max-w-lg cursor-pointer group/message ${
                  isConsecutive ? '' : 'mt-2'
                }`}
                onClick={() => handleMessageClick(message._id, isOwn)}
              >
                <div
                  className={`relative px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm border
                    ${isOwn
                      ? `bg-gradient-to-br from-primary/90 to-primary/80 text-primary-content border-primary/20
                         ${isConsecutive ? 'rounded-br-md' : 'rounded-br-lg'}
                         hover:shadow-xl hover:from-primary/95 hover:to-primary/85 transform hover:scale-[1.02]`
                      : `bg-gradient-to-br from-base-100/90 to-base-200/80 text-base-content border-base-300/30
                         ${isConsecutive ? 'rounded-bl-md' : 'rounded-bl-lg'}
                         hover:shadow-xl hover:from-base-100/95 hover:to-base-200/85 transform hover:scale-[1.02]`}
                    ${showDeleteFor === message._id ? 'ring-2 ring-error/50 shadow-error/20' : ''}
                    ${message.status === 'failed' ? 'border-error ring-2 ring-error/50' : ''}
                  `}
                >
                  {message.image && (
                    <div className="mb-3 relative group/image">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={message.image}
                          alt="sent"
                          className="max-w-[60vw] sm:max-w-sm max-h-80 object-cover shadow-md transition-transform duration-300 group-hover/image:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      </div>
                    </div>
                  )}

                  {message.text && (
                    <p className="break-words text-sm sm:text-base leading-relaxed">{message.text}</p>
                  )}

                  <div
                    className={`flex items-center justify-between mt-2 gap-2 ${
                      isOwn ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <span
                      className={`text-xs opacity-70 ${
                        isOwn ? 'text-primary-content/70' : 'text-base-content/70'
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </span>

                    {isOwn && (
                      <div className="flex items-center">
                        {message.status === 'sending' && (
                          <span className="loading loading-spinner loading-xs text-primary opacity-70"></span>
                        )}
                        {message.status === 'sent' && <Check className="w-4 h-4 opacity-50" />}
                        {message.status === 'delivered' && <CheckCheck className="w-4 h-4 opacity-50" />}
                        {message.status === 'read' && (
                          <CheckCheck className="w-4 h-4 text-success opacity-90" />
                        )}
                        {message.status === 'failed' && (
                          <span className="text-error text-xs font-bold">!</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {showDeleteFor === message._id && isOwn && (
                  <div className="absolute -top-2 -right-2 z-20 animate-in fade-in zoom-in duration-200">
                    <button
                      className="btn btn-error btn-sm btn-circle shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message._id);
                      }}
                      disabled={isDeletingMessage}
                      title="Delete message"
                    >
                      {isDeletingMessage ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isOwn && showAvatar && (
                <div
                  className="avatar shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => onProfileClick && onProfileClick(authUser)}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/30 ring-offset-1 ring-offset-base-100 shadow-md">
                    <img
                      src={authUser.profilePic || '/avatar.png'}
                      alt="profile"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {isOwn && !showAvatar && <div className="w-8 sm:w-10 shrink-0"></div>}
            </div>
          );
        })}

        {uniqueMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 opacity-60">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-accent/60 to-accent/40 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Start Your Conversation
            </h3>
            <p className="text-base-content/60 max-w-sm">
              Send your first message to begin this chat. Share text, images, and create memorable conversations!
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
