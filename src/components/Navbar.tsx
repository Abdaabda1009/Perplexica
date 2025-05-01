import { Clock, Edit, Share, Trash } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState, useRef } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';

const Navbar = ({
  chatId,
  messages,
}: {
  messages: Message[];
  chatId: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [hasUserEditedTitle, setHasUserEditedTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0 && !hasUserEditedTitle) {
      const newTitle =
        messages[0].content.length > 25
          ? `${messages[0].content.substring(0, 25).trim()}...`
          : messages[0].content;
      setTitle(newTitle);
      updateTimeAgo();
    }
  }, [messages, hasUserEditedTitle]);

  const updateTimeAgo = () => {
    if (messages.length > 0) {
      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt
      );
      setTimeAgo(newTimeAgo);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateTimeAgo, 30000);
    return () => clearInterval(intervalId);
  }, [messages]);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    setHasUserEditedTitle(true);
    // Add API call here to save the title
  };

  return (
    <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex items-center justify-between w-full h-16 text-sm text-black dark:text-white/70 border-b bg-white/95 dark:bg-dark-primary/95 backdrop-blur-sm shadow-sm border-light-100 dark:border-dark-200">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsEditingTitle(true)}
          className="p-2 rounded-lg hover:bg-light-100 dark:hover:bg-dark-300 transition-colors lg:hidden"
          aria-label="Edit title"
        >
          <Edit size={18} />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Clock size={16} />
          <span>{timeAgo} ago</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-4">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="w-full text-center bg-transparent border-b-2 border-blue-500 outline-none font-medium dark:text-white"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-center gap-2 group">
            <span
              className="text-lg font-semibold truncate cursor-text dark:text-white hover:bg-light-800 dark:hover:bg-dark-300 px-3 py-1 rounded-lg transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {title || 'New Chat'}
            </span>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-light-100 dark:hover:bg-dark-300 transition-colors"
              aria-label="Edit title"
            >
              <Edit size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg hover:bg-light-100 dark:hover:bg-dark-300 transition-colors"
          aria-label="Share chat"
        >
          <Share size={18} />
        </button>
        
        <DeleteChat 
          redirect 
          chatId={chatId} 
          chats={[]} 
          setChats={() => {}} 
          trigger={
            <button
              className="p-2 rounded-lg hover:bg-light-100 dark:hover:bg-dark-300 transition-colors text-red-500"
              aria-label="Delete chat"
            >
              <Trash size={18} />
            </button>
          }
        />
      </div>
    </div>
  );
};

export default Navbar;