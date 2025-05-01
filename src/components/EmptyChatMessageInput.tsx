import { ArrowRight, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import CopilotToggle from './MessageInputActions/Copilot';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';
import { cn } from '@/lib/utils';

interface EmptyChatMessageInputProps {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  placeholder?: string;
  className?: string;
}

const EmptyChatMessageInput = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
  placeholder = "Ask anything...",
  className,
}: EmptyChatMessageInputProps) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
    setFileIds(fileIds.filter(id => id !== fileId));
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
          handleSubmit(e);
        }
      }}
      className={cn("w-full group/form", className)}
    >
      <div className="flex flex-col bg-light-100 dark:bg-dark-100 px-4 pt-4 pb-2 rounded-xl w-full border-2 border-light-200 dark:border-dark-200 hover:border-light-100 dark:hover:border-dark-100 transition-all shadow-sm hover:shadow-md focus-within:ring-2 ring-blue-400/30">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center bg-light-50 dark:bg-dark-200 px-2 py-1 rounded-md text-sm border border-light-200 dark:border-dark-200 transition-all hover:bg-light-200 dark:hover:bg-dark-150"
              >
                <span className="max-w-[120px] truncate mr-1.5 text-light-800 dark:text-dark-50">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={1}
          maxRows={8}
          className="bg-transparent placeholder:text-light-200 dark:placeholder:text-dark-600/40 text-sm text-light-800 dark:text-dark-50 resize-none focus:outline-none w-full max-h-48 scrollbar-thin scrollbar-thumb-light-200 dark:scrollbar-thumb-dark-200 scrollbar-track-transparent focus:ring-0 rounded-md transition-all"
          placeholder={placeholder}
          aria-label="Type your message"
        />

        <div className="flex flex-row items-center justify-between mt-3">
          <div className="flex flex-row items-center space-x-2 lg:space-x-3">
            <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
            <Attach
              fileIds={fileIds}
              setFileIds={setFileIds}
              files={files}
              setFiles={setFiles}
              showText
              variant="ghost"
            />
          </div>

          <div className="flex flex-row items-center space-x-2 sm:space-x-3">
            <Optimization
              optimizationMode={optimizationMode}
              setOptimizationMode={setOptimizationMode}
            />
            
            <button
              type="submit"
              disabled={!message.trim()}
              className={cn(
                "p-2 rounded-lg flex items-center justify-center",
                "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
                "text-white transition-all transform hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-light-200 dark:disabled:bg-dark-200",
                "group/button relative shadow-sm hover:shadow-md"
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
              
              {!message.trim() && (
                <span className="absolute -top-8 right-0 bg-dark-200 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover/button:opacity-100 transition-opacity shadow-sm">
                  Add a message to send
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;