"use client";

/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useState } from 'react';
import { Message } from './ChatWindow';
import { cn } from '@/lib/utils';
import {
  BookCopy,
  Disc3,
  Volume2,
  StopCircle,
  Layers3,
  Plus,
} from 'lucide-react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import Copy from './MessageActions/Copy';
import Rewrite from './MessageActions/Rewrite';
import MessageSources from './MessageSources';
import SearchImages from './SearchImages';
import SearchVideos from './SearchVideos';
import { useSpeech } from 'react-text-to-speech';
import ThinkBox from './ThinkBox';

const ThinkTagProcessor = ({ children }: { children: React.ReactNode }) => {
  return <ThinkBox content={children as string} />;
};

const MessageBox = ({
  message,
  messageIndex,
  history,
  loading,
  dividerRef,
  isLast,
  rewrite,
  sendMessage,
}: {
  message: Message;
  messageIndex: number;
  history: Message[];
  loading: boolean;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
  rewrite: (messageId: string) => void;
  sendMessage: (message: string) => void;
}) => {
  const [parsedMessage, setParsedMessage] = useState(message.content);
  const [speechMessage, setSpeechMessage] = useState(message.content);

  useEffect(() => {
    const citationRegex = /\[([^\]]+)\]/g;
    const regex = /\[(\d+)\]/g;
    let processedMessage = message.content;

    if (message.role === 'assistant' && message.content.includes('<think>')) {
      const openThinkTag = processedMessage.match(/<think>/g)?.length || 0;
      const closeThinkTag = processedMessage.match(/<\/think>/g)?.length || 0;

      if (openThinkTag > closeThinkTag) {
        processedMessage += '</think> <a> </a>';
      }
    }

    if (
      message.role === 'assistant' &&
      message?.sources &&
      message.sources.length > 0
    ) {
      setParsedMessage(
        processedMessage.replace(
          citationRegex,
          (_, capturedContent: string) => {
            const numbers = capturedContent
              .split(',')
              .map((numStr) => numStr.trim());

            const linksHtml = numbers
              .map((numStr) => {
                const number = parseInt(numStr);
                if (isNaN(number) || number <= 0) return `[${numStr}]`;

                const source = message.sources?.[number - 1];
                const url = source?.metadata?.url;

                return url
                  ? `<a href="${url}" target="_blank" class="bg-light-200 dark:bg-dark-200 px-1.5 py-0.5 rounded-md ml-1 no-underline text-sm text-light-700 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-300 transition-colors duration-200">${numStr}</a>`
                  : `[${numStr}]`;
              })
              .join('');

            return linksHtml;
          },
        ),
      );
      setSpeechMessage(message.content.replace(regex, ''));
      return;
    }

    setSpeechMessage(message.content.replace(regex, ''));
    setParsedMessage(processedMessage);
  }, [message.content, message.sources, message.role]);

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  const markdownOverrides: MarkdownToJSX.Options = {
    overrides: {
      think: {
        component: ThinkTagProcessor,
      },
    },
  };

  return (
    <div>
      {message.role === 'user' && (
        <div
          className={cn(
            'w-full bg-light-100 dark:bg-dark-100 rounded-xl p-6',
            messageIndex === 0 ? 'mt-16' : 'mt-8',
            'break-words shadow-sm',
          )}
        >
          <h2 className="text-light-700 dark:text-dark-200 font-medium text-2xl lg:w-9/12">
            {message.content}
          </h2>
        </div>
      )}

      {message.role === 'assistant' && (
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-6">
          <div
            ref={dividerRef}
            className="flex flex-col gap-6 w-full lg:w-9/12"
          >
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-col gap-4 bg-light-50 dark:bg-dark-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <BookCopy className="text-light-600 dark:text-dark-400" size={20} />
                  <h3 className="text-light-700 dark:text-dark-200 font-medium text-xl">
                    Sources
                  </h3>
                </div>
                <MessageSources sources={message.sources} />
              </div>
            )}
            
            <div className="flex flex-col gap-4 bg-light-50 dark:bg-dark-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Disc3
                  className={cn(
                    'text-light-600 dark:text-dark-400',
                    isLast && loading ? 'animate-spin' : 'animate-none',
                  )}
                  size={20}
                />
                <h3 className="text-light-700 dark:text-dark-200 font-medium text-xl">
                  Answer
                </h3>
              </div>

              <Markdown
                className={cn(
                  'prose prose-h1:mb-3 prose-h2:mb-2 prose-h2:mt-6 prose-h2:font-[800] prose-h3:mt-4 prose-h3:mb-1.5 prose-h3:font-[600] dark:prose-invert prose-p:leading-relaxed prose-pre:bg-light-100 prose-pre:dark:bg-dark-100 prose-pre:p-4 prose-pre:rounded-lg font-[400]',
                  'max-w-none break-words text-light-700 dark:text-dark-300',
                )}
                options={markdownOverrides}
              >
                {parsedMessage}
              </Markdown>

              {!loading && isLast && (
                <div className="flex items-center justify-between border-t border-light-200 dark:border-dark-200 pt-4 -mx-2">
                  <div className="flex items-center gap-2">
                    <Rewrite rewrite={rewrite} messageId={message.messageId} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Copy initialMessage={message.content} message={message} />
                    <button
                      onClick={() => speechStatus === 'started' ? stop() : start()}
                      className="p-2 text-light-600 dark:text-dark-400 rounded-lg hover:bg-light-100 dark:hover:bg-dark-100 transition-colors duration-200"
                    >
                      {speechStatus === 'started' ? (
                        <StopCircle size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLast && message.suggestions?.length > 0 && !loading && (
                <div className="mt-6">
                  <div className="border-t border-light-200 dark:border-dark-200 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers3 className="text-light-600 dark:text-dark-400" />
                      <h3 className="text-light-700 dark:text-dark-200 font-medium text-xl">
                        Related Questions
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      {message.suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="group cursor-pointer p-3 rounded-lg hover:bg-light-100 dark:hover:bg-dark-100 transition-colors duration-200"
                          onClick={() => sendMessage(suggestion)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-light-700 dark:text-dark-300 font-medium group-hover:text-light-800 dark:group-hover:text-dark-200 transition-colors duration-200">
                              {suggestion}
                            </p>
                            <Plus className="text-light-600 dark:text-dark-400 group-hover:text-light-700 dark:group-hover:text-dark-300 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-20 flex flex-col items-center gap-4 w-full lg:w-3/12 h-full pb-4">
            <SearchImages
              query={history[messageIndex - 1].content}
              chatHistory={history.slice(0, messageIndex - 1)}
              messageId={message.messageId}
            />
            <SearchVideos
              chatHistory={history.slice(0, messageIndex - 1)}
              query={history[messageIndex - 1].content}
              messageId={message.messageId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;